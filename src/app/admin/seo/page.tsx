"use client";

import ActionButton from "@/components/ActionButton";
import CustomToast from "@/components/CustomToast";
import Input from "@/components/fields/Input";
import TextArea from "@/components/fields/TextArea";
import { Form, Formik, FormikProps } from "formik";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface FormValues {
    title: string;
    description: string;
    keywords: string;
}
interface PageOption {
    name: string;
    state: string;
}

const API_BASE = process.env.NEXT_PUBLIC_APP_BASE_URL ?? "http://localhost:9000/api";
const API_KEY  = process.env.NEXT_PUBLIC_API_KEY ?? "";
const EMPTY: FormValues = { title: "", description: "", keywords: "" };

async function fetchSeoList(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/generalSettings/group/seo`, {
        headers: { "Api-Key": API_KEY, "Content-Type": "application/json" },
        cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
}

async function saveSeo(payload: any, existingId?: number): Promise<void> {
    const token = typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("max-pharma-admin") || "null")?.token
        : null;
    const url    = existingId ? `${API_BASE}/generalSettings/${existingId}` : `${API_BASE}/generalSettings`;
    const method = existingId ? "PATCH" : "POST";
    const res = await fetch(url, {
        method,
        headers: {
            "Api-Key": API_KEY,
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `HTTP ${res.status}`);
    }
}

function parseInfos(infos: any): FormValues {
    if (!infos) return EMPTY;
    if (typeof infos === "string") {
        try { infos = JSON.parse(infos); } catch { return EMPTY; }
    }
    return {
        title:       String(infos?.title       ?? ""),
        description: String(infos?.description ?? ""),
        keywords:    String(infos?.keywords    ?? ""),
    };
}

const STATIC_PAGES: PageOption[] = [
    { name: "Home",                  state: "homeSeo" },
    { name: "Overview",              state: "overviewSeo" },
    { name: "Message From Chairman", state: "messageFromChairmanSeo" },
    { name: "Organization History",  state: "organizationHistorySeo" },
    { name: "Imported Products",     state: "importedProductsSeo" },
    { name: "Manufactured Products", state: "manufacturedProductsSeo" },
    { name: "Notice",                state: "noticeSeo" },
    { name: "Gallery",               state: "gallerySeo" },
    { name: "Contact",               state: "contactSeo" },
];

const SeoForm = () => {
    const [showToast, setShowToast]       = useState(false);
    const [toastError, setToastError]     = useState("");
    const [selectedPage, setSelectedPage] = useState<PageOption>(STATIC_PAGES[0]);
    const [loading, setLoading]           = useState(false);
    const [fetching, setFetching]         = useState(true);
    const [formValues, setFormValues]     = useState<FormValues>(EMPTY);
    // currentEntry tracks the DB record for the active tab — used for update vs create
    const [currentEntry, setCurrentEntry] = useState<any>(null);
    const formikRef = useRef<FormikProps<FormValues>>(null);

    // Keep a ref so submitHandler always sees the latest entry even if state is stale
    const currentEntryRef = useRef<any>(null);
    currentEntryRef.current = currentEntry;

    // Service categories from Redux for extra tabs
    const { data: serviceCategoriesRaw } = useSelector(
        (state: any) => state.serviceCategories || {}
    );
    const serviceCategories: PageOption[] = Array.isArray(serviceCategoriesRaw)
        ? serviceCategoriesRaw
              .filter((i: any) => i?.infos?.state)
              .map((i: any) => ({ name: String(i.value || ""), state: String(i.infos.state) }))
        : [];

    const pages: PageOption[] = [...STATIC_PAGES, ...serviceCategories];

    const loadSeo = useCallback(async (pageState: string) => {
        setFetching(true);
        setCurrentEntry(null);
        try {
            const list = await fetchSeoList();
            const match = list.find((item: any) => item.key === pageState) ?? null;
            // Set both in one update group so they're always in sync
            setCurrentEntry(match);
            setFormValues(match ? parseInfos(match.infos) : EMPTY);
        } catch (err: any) {
            console.error("SEO fetch error:", err?.message);
            setFormValues(EMPTY);
        } finally {
            setFetching(false);
        }
    }, []);

    useEffect(() => {
        loadSeo(selectedPage.state);
    }, [loadSeo, selectedPage.state]);

    const handlePageSelect = (page: PageOption) => {
        setSelectedPage(page);
    };

    const submitHandler = async (values: FormValues) => {
        setLoading(true);
        // Use the ref so we always have the latest entry id, not a stale closure value
        const entry = currentEntryRef.current;
        const payload = {
            group: "seo",
            key:   selectedPage.state,
            value: "seo",
            title: "seo",
            infos: { ...values },
        };
        try {
            await saveSeo(payload, entry?.id);
            setShowToast(true);
            await loadSeo(selectedPage.state);
        } catch (err: any) {
            setToastError(err?.message || "Failed to save SEO data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Page tabs */}
            <div className='bg-light-blue p-4 rounded-lg mb-8'>
                <h1>Seo Settings</h1>
                <div className='flex gap-2 flex-wrap justify-center p-12'>
                    {pages.map((page, i) => (
                        <div
                            key={i}
                            className={`rounded-lg px-2 py-1 text-sm font-normal transition duration-200 cursor-pointer ${
                                selectedPage.state === page.state
                                    ? "bg-primary text-white"
                                    : "bg-white text-primary hover:bg-blue-100"
                            }`}
                            onClick={() => handlePageSelect(page)}
                        >
                            {page.name}
                        </div>
                    ))}
                </div>
            </div>

            {fetching ? (
                <div className="flex items-center gap-2 py-8 text-gray-400 text-sm">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary" />
                    Loading&hellip;
                </div>
            ) : (
                <Formik
                    key={`${selectedPage.state}::${currentEntry?.id ?? "new"}`}
                    innerRef={formikRef}
                    initialValues={formValues}
                    onSubmit={submitHandler}
                    enableReinitialize
                >
                    {({ handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <Input
                                name='title'
                                label='Meta Title'
                                placeholder='Meta Title'
                            />
                            <TextArea
                                name='description'
                                label='Meta Description'
                                placeholder='Meta Description'
                            />
                            <TextArea
                                name='keywords'
                                label='Meta Keywords'
                                placeholder='Comma separated keywords'
                            />
                            <ActionButton type='submit' loading={loading}>
                                {currentEntry?.id ? "Update" : "Save"}
                            </ActionButton>
                        </Form>
                    )}
                </Formik>
            )}

            {showToast && (
                <CustomToast
                    title='Success'
                    message='SEO settings saved successfully'
                    onClose={() => setShowToast(false)}
                />
            )}
            {toastError && (
                <CustomToast
                    title='Error'
                    message={toastError}
                    onClose={() => setToastError("")}
                />
            )}
        </>
    );
};

export default SeoForm;
