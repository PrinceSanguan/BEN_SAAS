// Update PageContent.tsx - Remove modal and replace with new tab
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, useForm } from '@inertiajs/react';
import { ExternalLink, Eye } from 'lucide-react';
import { useState } from 'react';

interface PageContentProps {
    contents: Record<
        string,
        Array<{
            id: number;
            section: string;
            field: string;
            value: string;
            type: string;
        }>
    >;
    activePage: 'dashboard' | 'email-templates' | 'summaries' | 'page-content';
}

export default function PageContent({ contents, activePage }: PageContentProps) {
    const [editingField, setEditingField] = useState<string | null>(null);
    const { data, setData, post, processing, reset } = useForm({
        section: '',
        field: '',
        value: '',
        type: 'text',
        image: null as File | null,
    });

    const handleEdit = (section: string, field: string, value: string, type: string) => {
        setData({ section, field, value, type, image: null });
        setEditingField(`${section}-${field}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.page-content.update'), {
            onSuccess: () => {
                setEditingField(null);
                reset();
            },
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'image/webp') {
                alert('Please select a WebP image file only.');
                e.target.value = '';
                return;
            }
            setData('image', file);
        }
    };

    const openPreview = () => {
        window.open(route('admin.page-content.preview'), '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    };

    return (
        <>
            <Head title="Page Content Management" />
            <div className="flex min-h-screen bg-[#0a1e3c]">
                <AdminSidebar activePage={activePage} />

                <main className="ml-64 flex-1 p-8">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-8 flex items-center justify-between">
                            <h1 className="text-3xl font-bold text-white">Page Content Management</h1>
                            <Button onClick={openPreview} className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700">
                                <Eye className="h-4 w-4" />
                                Preview Landing Page
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </div>

                        {Object.entries(contents).map(([section, fields]) => (
                            <Card key={section} className="mb-6 border-slate-700 bg-slate-800">
                                <CardHeader>
                                    <CardTitle className="text-white capitalize">{section} Section</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {fields.map((field) => (
                                        <div key={field.id} className="rounded-lg border border-slate-600 p-4">
                                            <div className="mb-2 flex items-start justify-between">
                                                <div>
                                                    <label className="text-sm font-medium text-slate-300 capitalize">
                                                        {field.field.replace(/_/g, ' ')}
                                                    </label>
                                                    <span className="ml-2 text-xs text-slate-400">({field.type})</span>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleEdit(field.section, field.field, field.value, field.type)}
                                                    disabled={editingField === `${field.section}-${field.field}`}
                                                >
                                                    Edit
                                                </Button>
                                            </div>

                                            {editingField === `${field.section}-${field.field}` ? (
                                                <form onSubmit={handleSubmit} className="space-y-3">
                                                    {field.type === 'image' ? (
                                                        <div>
                                                            <input
                                                                type="file"
                                                                accept="image/webp"
                                                                onChange={handleImageChange}
                                                                className="w-full rounded border border-slate-600 bg-slate-700 p-2 text-white"
                                                            />
                                                            <p className="mt-1 text-xs text-slate-400">Only WebP format is allowed</p>
                                                            {field.value && (
                                                                <div className="mt-2">
                                                                    <img
                                                                        src={`/upload-image/${field.value}`}
                                                                        alt="Current"
                                                                        className="h-20 w-20 rounded object-cover"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <textarea
                                                            value={data.value}
                                                            onChange={(e) => setData('value', e.target.value)}
                                                            className="w-full resize-none rounded border border-slate-600 bg-slate-700 p-3 text-white"
                                                            rows={field.type === 'text' ? 3 : 1}
                                                        />
                                                    )}
                                                    <div className="flex gap-2">
                                                        <Button type="submit" size="sm" disabled={processing}>
                                                            Save
                                                        </Button>
                                                        <Button type="button" variant="outline" size="sm" onClick={() => setEditingField(null)}>
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div className="text-slate-300">
                                                    {field.type === 'image' ? (
                                                        field.value ? (
                                                            <img
                                                                src={`/upload-image/${field.value}`}
                                                                alt="Current"
                                                                className="h-20 w-20 rounded object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-slate-500">No image uploaded</span>
                                                        )
                                                    ) : (
                                                        <span className="whitespace-pre-wrap">{field.value}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
}
