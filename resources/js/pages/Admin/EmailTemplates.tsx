import AdminSidebar from '@/components/admin/AdminSidebar';
import Notification from '@/components/admin/dashboard/Notification';
import { Head, router, usePage } from '@inertiajs/react';
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    AtSign,
    Bold,
    Building,
    Check,
    ChevronDown,
    ChevronUp,
    Eye,
    EyeOff,
    Info,
    Italic,
    Key,
    List,
    Mail,
    Plus,
    Save,
    Settings,
    Underline,
    User,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface EmailTemplate {
    id: number;
    name: string;
    subject: string;
    content: string;
}

interface Props {
    templates: EmailTemplate[];
    activePage: 'dashboard' | 'email-templates';
}

interface Variable {
    label: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    category: string;
}

export default function EmailTemplates({ templates, activePage }: Props) {
    const { flash } = usePage().props as any;
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
    const [formData, setFormData] = useState({ subject: '', content: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showVariablePanel, setShowVariablePanel] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);
    const [cursorPosition, setCursorPosition] = useState<{ start: number; end: number } | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Auto-save functionality
    useEffect(() => {
        if (isDirty && selectedTemplate) {
            const timer = setTimeout(() => {
                // Auto-save logic would go here
                setLastSaved(new Date());
                setIsDirty(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isDirty, formData, selectedTemplate]);

    useEffect(() => {
        if (flash?.success) {
            setNotification({ message: flash.success, type: 'success' });
        } else if (flash?.error) {
            setNotification({ message: flash.error, type: 'error' });
        }
    }, [flash]);

    const variables: Variable[] = [
        {
            label: "Recipient's Name",
            value: '{{ $username }}',
            icon: User,
            description: "The athlete's username",
            category: 'User Information',
        },
        {
            label: 'Email Address',
            value: '{{ $email }}',
            icon: Mail,
            description: "The recipient's email address",
            category: 'User Information',
        },
        {
            label: 'Password Reset Link',
            value: '{{ $resetUrl }}',
            icon: Key,
            description: 'Secure link for password reset',
            category: 'System Links',
        },
        {
            label: 'Company Name',
            value: '{{ $companyName }}',
            icon: Building,
            description: "Your organization's name",
            category: 'Company Information',
        },
        {
            label: 'Support Email',
            value: '{{ $supportEmail }}',
            icon: AtSign,
            description: 'Customer support contact',
            category: 'Company Information',
        },
    ];

    const getVariablesForTemplate = (templateName: string) => {
        if (templateName === 'password_reset') {
            return variables.filter((v) => ['{{ $email }}', '{{ $resetUrl }}', '{{ $supportEmail }}'].includes(v.value));
        }
        return variables.filter((v) => ['{{ $username }}', '{{ $email }}', '{{ $resetUrl }}', '{{ $supportEmail }}'].includes(v.value));
    };

    const handleSelectTemplate = (template: EmailTemplate) => {
        setSelectedTemplate(template);
        // Convert HTML to rich text for editing
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = template.content;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';

        setFormData({
            subject: template.subject,
            content: template.content,
        });
        setIsDirty(false);
        setShowPreview(false);
    };

    const handleContentChange = (newContent: string) => {
        setFormData((prev) => ({ ...prev, content: newContent }));
        setIsDirty(true);
    };

    const insertVariable = (variable: Variable) => {
        const editor = editorRef.current;
        if (!editor) return;

        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);

            // Create variable badge
            const variableBadge = document.createElement('span');
            variableBadge.className =
                'inline-flex items-center px-2 py-1 mx-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200 cursor-pointer hover:bg-blue-200 transition-colors';
            variableBadge.contentEditable = 'false';
            variableBadge.setAttribute('data-variable', variable.value);
            variableBadge.innerHTML = `
                <${variable.icon.name === 'User' ? 'User' : variable.icon.name === 'Mail' ? 'Mail' : variable.icon.name === 'Key' ? 'Key' : variable.icon.name === 'Building' ? 'Building' : 'AtSign'} class="w-3 h-3 mr-1" />
                ${variable.label}
            `;

            range.deleteContents();
            range.insertNode(variableBadge);

            // Move cursor after the inserted variable
            const newRange = document.createRange();
            newRange.setStartAfter(variableBadge);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
        }

        setIsDirty(true);
        setShowVariablePanel(false);
    };

    const applyFormatting = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        setIsDirty(true);
    };

    const getFormattedContent = () => {
        if (!editorRef.current) return formData.content;

        let content = editorRef.current.innerHTML;

        // Replace variable badges with actual template syntax
        const variableBadges = editorRef.current.querySelectorAll('[data-variable]');
        variableBadges.forEach((badge) => {
            const variableValue = badge.getAttribute('data-variable');
            if (variableValue) {
                content = content.replace(badge.outerHTML, variableValue);
            }
        });

        return content;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTemplate) return;

        setIsSubmitting(true);
        const finalContent = getFormattedContent();

        router.put(
            `/admin/email-templates/${selectedTemplate.name}`,
            {
                ...formData,
                content: finalContent,
            },
            {
                onSuccess: () => {
                    setIsSubmitting(false);
                    setIsDirty(false);
                    setLastSaved(new Date());
                    setNotification({ message: 'Template updated successfully!', type: 'success' });
                },
                onError: () => {
                    setIsSubmitting(false);
                    setNotification({ message: 'Failed to update template.', type: 'error' });
                },
            },
        );
    };

    const getPreviewContent = () => {
        if (!selectedTemplate) return '';

        let content = getFormattedContent();

        // Replace variables with sample data for preview
        content = content
            .replace(/\{\{\s*\$username\s*\}\}/g, 'John Doe')
            .replace(/\{\{\s*\$email\s*\}\}/g, 'parent@example.com')
            .replace(/\{\{\s*\$resetUrl\s*\}\}/g, 'https://yourapp.com/reset-password/token123')
            .replace(/\{\{\s*\$companyName\s*\}\}/g, 'Young Athlete Training')
            .replace(/\{\{\s*\$supportEmail\s*\}\}/g, 'support@yourapp.com');

        return content;
    };

    const VariableButton = ({ variable }: { variable: Variable }) => (
        <button
            type="button"
            onClick={() => insertVariable(variable)}
            className="group flex w-full items-center rounded-lg p-3 text-left text-gray-700 transition-colors hover:bg-blue-50"
        >
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 transition-colors group-hover:bg-blue-200">
                <variable.icon className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
                <div className="text-sm font-medium">{variable.label}</div>
                <div className="text-xs text-gray-500">{variable.description}</div>
            </div>
            <Plus className="h-4 w-4 text-gray-400 transition-colors group-hover:text-blue-600" />
        </button>
    );

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-[#0a1e3c] to-[#0f2a4a]">
            <div className="hidden md:block">
                <AdminSidebar activePage={activePage} />
            </div>
            <div className="block md:hidden">
                <AdminSidebar activePage={activePage} isMobile={true} />
            </div>

            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

            <main className="flex-1 p-4 pt-6 pb-24 md:ml-64 md:p-6 md:pt-6 md:pb-6">
                <Head title="Email Templates" />

                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Email Templates</h1>
                            <p className="mt-1 text-sm text-gray-400">Create professional emails that automatically include recipient information</p>
                        </div>
                        {lastSaved && (
                            <div className="flex items-center text-xs text-gray-400">
                                <Check className="mr-1 h-3 w-3" />
                                Saved {lastSaved.toLocaleTimeString()}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-12 gap-6">
                        {/* Template Selection Sidebar */}
                        <div className="col-span-12 lg:col-span-3">
                            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                                <div className="border-b border-gray-200 bg-gray-50 p-4">
                                    <h2 className="font-semibold text-gray-900">Email Templates</h2>
                                </div>
                                <div className="space-y-2 p-4">
                                    {templates.map((template) => (
                                        <button
                                            key={template.id}
                                            onClick={() => handleSelectTemplate(template)}
                                            className={`w-full rounded-lg border-2 p-4 text-left transition-all duration-200 ${
                                                selectedTemplate?.id === template.id
                                                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                                        template.name === 'password_reset'
                                                            ? 'bg-orange-100 text-orange-600'
                                                            : 'bg-green-100 text-green-600'
                                                    }`}
                                                >
                                                    {template.name === 'password_reset' ? <Key className="h-5 w-5" /> : <User className="h-5 w-5" />}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {template.name === 'password_reset' ? 'Password Reset' : 'Welcome Email'}
                                                    </div>
                                                    <div className="truncate text-xs text-gray-500">
                                                        {template.name === 'password_reset'
                                                            ? 'Sent when users reset passwords'
                                                            : 'Sent to new athlete accounts'}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Editor */}
                        <div className="col-span-12 lg:col-span-9">
                            {selectedTemplate ? (
                                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                                    {/* Email Compose Header */}
                                    <div className="border-b border-gray-200 bg-gray-50 p-6">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                Editing: {selectedTemplate.name === 'password_reset' ? 'Password Reset Email' : 'Welcome Email'}
                                            </h2>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowVariablePanel(!showVariablePanel)}
                                                    className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                                        showVariablePanel
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    <AtSign className="mr-2 h-4 w-4" />
                                                    Add Info
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPreview(!showPreview)}
                                                    className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                                        showPreview ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {showPreview ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                                                    {showPreview ? 'Edit' : 'Preview'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Subject Line */}
                                        <div className="space-y-3">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700">Email Subject Line</label>
                                                <input
                                                    type="text"
                                                    value={formData.subject}
                                                    onChange={(e) => {
                                                        setFormData({ ...formData, subject: e.target.value });
                                                        setIsDirty(true);
                                                    }}
                                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Enter the email subject line..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Variable Panel */}
                                    {showVariablePanel && (
                                        <div className="border-b border-blue-200 bg-blue-50 p-4">
                                            <div className="mb-3 flex items-center justify-between">
                                                <h3 className="font-medium text-blue-900">Add Recipient Information</h3>
                                                <button onClick={() => setShowVariablePanel(false)} className="text-blue-600 hover:text-blue-800">
                                                    <ChevronUp className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                {getVariablesForTemplate(selectedTemplate.name).map((variable) => (
                                                    <VariableButton key={variable.value} variable={variable} />
                                                ))}
                                            </div>
                                            <div className="mt-3 rounded-lg bg-blue-100 p-3">
                                                <div className="flex items-start space-x-2">
                                                    <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                                                    <div className="text-xs text-blue-800">
                                                        <strong>Tip:</strong> Click any button above to insert that information into your email. The
                                                        actual values will be filled in automatically when the email is sent.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {!showPreview ? (
                                        /* Rich Text Editor */
                                        <div className="p-6">
                                            {/* Formatting Toolbar */}
                                            <div className="flex flex-wrap items-center space-x-1 rounded-t-lg border border-gray-200 bg-gray-50 p-3">
                                                <button
                                                    type="button"
                                                    onClick={() => applyFormatting('bold')}
                                                    className="rounded p-2 text-gray-600 transition-colors hover:bg-gray-200"
                                                    title="Bold"
                                                >
                                                    <Bold className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => applyFormatting('italic')}
                                                    className="rounded p-2 text-gray-600 transition-colors hover:bg-gray-200"
                                                    title="Italic"
                                                >
                                                    <Italic className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => applyFormatting('underline')}
                                                    className="rounded p-2 text-gray-600 transition-colors hover:bg-gray-200"
                                                    title="Underline"
                                                >
                                                    <Underline className="h-4 w-4" />
                                                </button>

                                                <div className="mx-2 h-6 w-px bg-gray-300" />

                                                <button
                                                    type="button"
                                                    onClick={() => applyFormatting('justifyLeft')}
                                                    className="rounded p-2 text-gray-600 transition-colors hover:bg-gray-200"
                                                    title="Align Left"
                                                >
                                                    <AlignLeft className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => applyFormatting('justifyCenter')}
                                                    className="rounded p-2 text-gray-600 transition-colors hover:bg-gray-200"
                                                    title="Align Center"
                                                >
                                                    <AlignCenter className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => applyFormatting('justifyRight')}
                                                    className="rounded p-2 text-gray-600 transition-colors hover:bg-gray-200"
                                                    title="Align Right"
                                                >
                                                    <AlignRight className="h-4 w-4" />
                                                </button>

                                                <div className="mx-2 h-6 w-px bg-gray-300" />

                                                <button
                                                    type="button"
                                                    onClick={() => applyFormatting('insertUnorderedList')}
                                                    className="rounded p-2 text-gray-600 transition-colors hover:bg-gray-200"
                                                    title="Bullet List"
                                                >
                                                    <List className="h-4 w-4" />
                                                </button>

                                                <div className="flex-1" />

                                                <select
                                                    onChange={(e) => applyFormatting('fontSize', e.target.value)}
                                                    className="rounded border border-gray-300 px-2 py-1 text-sm"
                                                    defaultValue="3"
                                                >
                                                    <option value="1">Small</option>
                                                    <option value="3">Normal</option>
                                                    <option value="5">Large</option>
                                                    <option value="7">Extra Large</option>
                                                </select>
                                            </div>

                                            {/* Content Editor */}
                                            <div
                                                ref={editorRef}
                                                contentEditable
                                                onInput={(e) => handleContentChange(e.currentTarget.innerHTML)}
                                                className="min-h-[400px] rounded-b-lg border border-t-0 border-gray-200 bg-white p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                style={{ lineHeight: '1.6' }}
                                                dangerouslySetInnerHTML={{ __html: formData.content }}
                                            />

                                            <div className="mt-4 text-xs text-gray-500">
                                                Click "Add Info" above to insert recipient information like names and email addresses. Use the
                                                formatting toolbar to style your text.
                                            </div>
                                        </div>
                                    ) : (
                                        /* Preview Mode */
                                        <div className="p-6">
                                            <div className="mb-4 rounded-lg bg-gray-50 p-4">
                                                <h3 className="mb-2 font-medium text-gray-900">Preview with Sample Data</h3>
                                                <p className="text-sm text-gray-600">This shows how your email will look when sent to recipients.</p>
                                            </div>

                                            <div className="overflow-hidden rounded-lg border-2 border-gray-200 bg-white">
                                                <div className="border-b border-gray-200 bg-gray-100 px-4 py-3">
                                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                        <span>
                                                            <strong>To:</strong> parent@example.com
                                                        </span>
                                                        <span>
                                                            <strong>Subject:</strong> {formData.subject}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="prose max-w-none p-6" dangerouslySetInnerHTML={{ __html: getPreviewContent() }} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer Actions */}
                                    <form onSubmit={handleSubmit}>
                                        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 p-6">
                                            <div className="flex items-center space-x-4">
                                                {isDirty && (
                                                    <div className="flex items-center text-sm text-amber-600">
                                                        <div className="mr-2 h-2 w-2 rounded-full bg-amber-400"></div>
                                                        Unsaved changes
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                                    className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                                                >
                                                    <Settings className="mr-1 h-4 w-4" />
                                                    Advanced Options
                                                    {showAdvanced ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                                                </button>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="mr-2 h-4 w-4" />
                                                        Save Template
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>

                                    {/* Advanced Options */}
                                    {showAdvanced && (
                                        <div className="border-t border-gray-200 bg-gray-50 px-6 pb-6">
                                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                                <div className="flex items-start space-x-2">
                                                    <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
                                                    <div>
                                                        <h4 className="font-medium text-yellow-800">For Advanced Users</h4>
                                                        <p className="mt-1 text-sm text-yellow-700">
                                                            These templates automatically handle mobile responsiveness, email client compatibility,
                                                            and branding. Additional customization options are available through the system settings.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Empty State */
                                <div className="rounded-xl border border-gray-200 bg-white p-12 shadow-sm">
                                    <div className="text-center">
                                        <Mail className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                                        <h3 className="mb-2 text-lg font-medium text-gray-900">Select an Email Template</h3>
                                        <p className="mb-6 text-gray-600">
                                            Choose a template from the left panel to start customizing your emails. You can add recipient information,
                                            format text, and preview your changes.
                                        </p>
                                        <div className="inline-flex items-center rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
                                            <Info className="mr-2 h-4 w-4" />
                                            Templates automatically include recipient names and other personalized information
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
