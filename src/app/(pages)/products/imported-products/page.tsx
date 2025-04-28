import Products from "@/features/Products";
import { getSeoMetadata } from "@/utils/seo";

export async function generateMetadata() {
    return await getSeoMetadata("importedProductsSeo");
}

const page = () => {
    return (
        <div>
            <section className='space-y-4'>
                <Products type='Imported Products' />
            </section>
        </div>
    );
};

export default page;
