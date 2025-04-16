"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { Formik, useFormikContext, Field } from "formik";
import {
    Bold,
    Italic,
    Heading1,
    List,
    Pilcrow,
    ListOrdered,
    Quote,
    Code,
} from "lucide-react";

interface MyEditorProps {
    name: string;
    label?: string;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
    onChange?: (value: string) => void;
}

// Separate editor component to properly use React hooks
const EditorComponent = ({
    name,
    value,
    hasError,
    disabled,
    placeholder,
    onChange,
}: {
    name: string;
    value: string;
    hasError: boolean;
    disabled: boolean;
    placeholder: string;
    onChange: (html: string) => void;
}) => {
    const { setFieldValue } = useFormikContext();

    const editor = useEditor({
        extensions: [StarterKit],
        content: value || "<p></p>",
        editorProps: {
            attributes: {
                class: `min-h-[200px] p-3 rounded-md ${
                    hasError
                        ? "border-2 border-red-500 focus:ring-red-200"
                        : "border border-slate-300 focus:ring-blue-100"
                } ${
                    disabled ? "bg-slate-50 cursor-not-allowed" : "bg-white"
                } focus:outline-none focus:ring-2 focus:border-blue-400 transition-colors`,
                placeholder: placeholder,
            },
        },
        injectCSS: true,
        autofocus: false,
        editable: !disabled,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setFieldValue(name, html);
            if (onChange) onChange(html);
        },
    });

    // Update editor content when value changes externally
    useEffect(() => {
        if (!editor) return;

        // Only update if the content actually changed
        const currentContent = editor.getHTML();
        if (value !== currentContent) {
            editor.commands.setContent(value || "");
        }
    }, [value, editor]);

    if (!editor) return null;

    // Function to handle bullet list toggling with focus
    const handleBulletList = () => {
        editor.chain().focus().toggleBulletList().run();
    };

    // Function to handle ordered list toggling with focus
    const handleOrderedList = () => {
        editor.chain().focus().toggleOrderedList().run();
    };

    return (
        <>
            {/* Enhanced Toolbar */}
            <div
                className='flex flex-wrap gap-1 mb-2 p-2 bg-slate-100 rounded-md border border-slate-200'
                style={{
                    opacity: disabled ? 0.5 : 1,
                    pointerEvents: disabled ? "none" : "auto",
                }}
            >
                <button
                    type='button'
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded hover:bg-slate-200 transition-colors ${
                        editor.isActive("bold")
                            ? "bg-blue-100 text-blue-700"
                            : "text-slate-700"
                    }`}
                    title='Bold'
                >
                    <Bold size={18} />
                </button>
                <button
                    type='button'
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded hover:bg-slate-200 transition-colors ${
                        editor.isActive("italic")
                            ? "bg-blue-100 text-blue-700"
                            : "text-slate-700"
                    }`}
                    title='Italic'
                >
                    <Italic size={18} />
                </button>
                <button
                    type='button'
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={`p-1.5 rounded hover:bg-slate-200 transition-colors ${
                        editor.isActive("paragraph") &&
                        !editor.isActive("bulletList") &&
                        !editor.isActive("orderedList")
                            ? "bg-blue-100 text-blue-700"
                            : "text-slate-700"
                    }`}
                    title='Paragraph'
                >
                    <Pilcrow size={18} />
                </button>
                <button
                    type='button'
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className={`p-1.5 rounded hover:bg-slate-200 transition-colors ${
                        editor.isActive("heading", { level: 1 })
                            ? "bg-blue-100 text-blue-700"
                            : "text-slate-700"
                    }`}
                    title='Heading 1'
                >
                    <Heading1 size={18} />
                </button>
                <button
                    type='button'
                    onClick={handleBulletList}
                    className={`p-1.5 rounded hover:bg-slate-200 transition-colors ${
                        editor.isActive("bulletList")
                            ? "bg-blue-100 text-blue-700"
                            : "text-slate-700"
                    }`}
                    title='Bullet List'
                >
                    <List size={18} />
                </button>
                <button
                    type='button'
                    onClick={handleOrderedList}
                    className={`p-1.5 rounded hover:bg-slate-200 transition-colors ${
                        editor.isActive("orderedList")
                            ? "bg-blue-100 text-blue-700"
                            : "text-slate-700"
                    }`}
                    title='Numbered List'
                >
                    <ListOrdered size={18} />
                </button>
                <button
                    type='button'
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    className={`p-1.5 rounded hover:bg-slate-200 transition-colors ${
                        editor.isActive("blockquote")
                            ? "bg-blue-100 text-blue-700"
                            : "text-slate-700"
                    }`}
                    title='Quote'
                >
                    <Quote size={18} />
                </button>
                <button
                    type='button'
                    onClick={() =>
                        editor.chain().focus().toggleCodeBlock().run()
                    }
                    className={`p-1.5 rounded hover:bg-slate-200 transition-colors ${
                        editor.isActive("codeBlock")
                            ? "bg-blue-100 text-blue-700"
                            : "text-slate-700"
                    }`}
                    title='Code Block'
                >
                    <Code size={18} />
                </button>
            </div>

            {/* Editor content area */}
            <EditorContent
                editor={editor}
                className='editor-content prose prose-sm max-w-none'
            />

            {/* Add global styles for proper list rendering */}
            <style jsx global>{`
                .ProseMirror ul {
                    list-style-type: disc;
                    padding-left: 1.5em;
                }
                .ProseMirror ol {
                    list-style-type: decimal;
                    padding-left: 1.5em;
                }
                .ProseMirror p {
                    margin: 0.5em 0;
                }
                .ProseMirror {
                    min-height: 200px;
                }
                .ProseMirror:focus {
                    outline: none;
                }
            `}</style>
        </>
    );
};

export default function MyEditor({
    name,
    label,
    className = "",
    placeholder = "Start typing...",
    disabled = false,
    onChange,
}: MyEditorProps) {
    return (
        <Field name={name}>
            {({ field, meta, form }: any) => {
                const hasError = meta.touched && meta.error;

                return (
                    <div className={`mb-4 ${className}`}>
                        {!!label && (
                            <label
                                htmlFor={name}
                                className={`block text-sm font-medium mb-2 ${
                                    hasError ? "text-red-600" : "text-slate-700"
                                }`}
                            >
                                {label}
                            </label>
                        )}

                        <EditorComponent
                            name={name}
                            value={field.value}
                            hasError={!!hasError}
                            disabled={disabled}
                            placeholder={placeholder}
                            onChange={(html) => {
                                if (onChange) onChange(html);
                            }}
                        />

                        {!!hasError && (
                            <p className='mt-1 text-sm text-red-500'>
                                {meta.error}
                            </p>
                        )}
                    </div>
                );
            }}
        </Field>
    );
}
