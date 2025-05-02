import { router } from '@inertiajs/react';
import { useState } from 'react';

type Athlete = {
    id: number;
    username: string;
    email: string;
    training_results?: {
        standing_long_jump: number | null;
        single_leg_jump_left: number | null;
        single_leg_jump_right: number | null;
        single_leg_wall_sit_left: number | null;
        single_leg_wall_sit_right: number | null;
        core_endurance: number | null;
        bent_arm_hang: number | null;
    };
    bent_arm_enabled?: boolean;
};

interface AthleteFormData {
    username: string;
    parentEmail: string;
    password: string;
    standingLongJump: string;
    singleLegJumpLeft: string;
    singleLegJumpRight: string;
    singleLegWallSitLeft: string;
    singleLegWallSitRight: string;
    coreEnduranceLeft: string; // Changed from coreEndurance
    coreEnduranceRight: string; // Added new field
    bentArmHang: string;
    bentArmHangEnabled: boolean;
    [key: string]: string | number | boolean | undefined;
}

// Also update FormattedData interface:
interface FormattedData {
    username: string;
    parent_email: string;
    password: string;
    standing_long_jump: number | null;
    single_leg_jump_left: number | null;
    single_leg_jump_right: number | null;
    single_leg_wall_sit_left: number | null;
    single_leg_wall_sit_right: number | null;
    core_endurance_left: number | null; // Changed from core_endurance
    core_endurance_right: number | null; // Added new field
    bent_arm_hang: number | null;
    bent_arm_enabled: boolean;
    training_results: {
        standing_long_jump: number | null;
        single_leg_jump_left: number | null;
        single_leg_jump_right: number | null;
        single_leg_wall_sit_left: number | null;
        single_leg_wall_sit_right: number | null;
        core_endurance_left: number | null; // Changed from core_endurance
        core_endurance_right: number | null; // Added new field
        bent_arm_hang: number | null;
    };
    [key: string]: any; // Allow additional properties
}
interface FlashData {
    newAthlete?: Athlete;
    [key: string]: unknown;
}

interface InertiaPage {
    props: {
        flash?: FlashData;
        [key: string]: unknown;
    };
}

export default function useAthleteForm(athletes: Athlete[], setAthletes: React.Dispatch<React.SetStateAction<Athlete[]>>) {
    // Form state
    const [form, setForm] = useState<AthleteFormData>({
        username: '',
        parentEmail: '',
        password: '',
        standingLongJump: '',
        singleLegJumpLeft: '',
        singleLegJumpRight: '',
        singleLegWallSitLeft: '',
        singleLegWallSitRight: '',
        coreEnduranceLeft: '',
        coreEnduranceRight: '',
        bentArmHang: '',
        bentArmHangEnabled: false,
    });

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [formattedData, setFormattedData] = useState<FormattedData | null>(null);

    // Loading and error states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    // Handle checkbox changes
    const handleCheckboxChange = (field: string, checked: boolean) => {
        setForm((prev) => {
            const updated = { ...prev, [field]: checked };

            // If bentArmHangEnabled is being turned off, clear the bentArmHang value
            if (field === 'bentArmHangEnabled' && !checked) {
                updated.bentArmHang = '';
            }

            return updated;
        });
    };

    // Format form data for submission to match Laravel controller expectations
    const formatFormData = (): FormattedData => {
        // Get training result values
        const standingLongJump = form.standingLongJump === '' ? null : Number(form.standingLongJump);
        const singleLegJumpLeft = form.singleLegJumpLeft === '' ? null : Number(form.singleLegJumpLeft);
        const singleLegJumpRight = form.singleLegJumpRight === '' ? null : Number(form.singleLegJumpRight);
        const singleLegWallSitLeft = form.singleLegWallSitLeft === '' ? null : Number(form.singleLegWallSitLeft);
        const singleLegWallSitRight = form.singleLegWallSitRight === '' ? null : Number(form.singleLegWallSitRight);
        const coreEnduranceLeft = form.coreEnduranceLeft === '' ? null : Number(form.coreEnduranceLeft);
        const coreEnduranceRight = form.coreEnduranceRight === '' ? null : Number(form.coreEnduranceRight);

        // Only use bentArmHang value if enabled
        const bentArmHang = form.bentArmHangEnabled && form.bentArmHang !== '' ? Number(form.bentArmHang) : null;

        // Create the formatted data object with both flat and nested structures
        const formData: FormattedData = {
            username: form.username,
            parent_email: form.parentEmail,
            password: form.password,
            bent_arm_enabled: form.bentArmHangEnabled,

            // Add flat fields for validation
            standing_long_jump: standingLongJump,
            single_leg_jump_left: singleLegJumpLeft,
            single_leg_jump_right: singleLegJumpRight,
            single_leg_wall_sit_left: singleLegWallSitLeft,
            single_leg_wall_sit_right: singleLegWallSitRight,
            core_endurance_left: coreEnduranceLeft,
            core_endurance_right: coreEnduranceRight,
            bent_arm_hang: bentArmHang,

            // Add nested structure for controller processing
            training_results: {
                standing_long_jump: standingLongJump,
                single_leg_jump_left: singleLegJumpLeft,
                single_leg_jump_right: singleLegJumpRight,
                single_leg_wall_sit_left: singleLegWallSitLeft,
                single_leg_wall_sit_right: singleLegWallSitRight,
                core_endurance_left: coreEnduranceLeft,
                core_endurance_right: coreEnduranceRight,
                bent_arm_hang: bentArmHang,
            },
        };

        console.log('Formatted form data:', formData);
        return formData;
    };

    // Step 1: Show confirmation dialog
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        // Format the data and store it for later use
        const data = formatFormData();
        setFormattedData(data);

        // Show confirmation dialog
        setShowConfirmation(true);
    };

    // Step 2: Actual form submission after confirmation
    const confirmSubmit = () => {
        if (!formattedData) return;

        setIsSubmitting(true);

        console.log('FULL FORM DATA:', JSON.stringify(formattedData, null, 2));

        router.post('/admin/athletes', formattedData, {
            onStart: () => {
                console.log('Form submission starting!');
                setIsSubmitting(true);
            },
            onFinish: () => {
                console.log('Form submission finished!');
                setIsSubmitting(false);
                setShowConfirmation(false);
            },
            onSuccess: (page: InertiaPage) => {
                console.log('Form submission successful!', page);

                // Reset form
                setForm({
                    username: '',
                    parentEmail: '',
                    password: '',
                    standingLongJump: '',
                    singleLegJumpLeft: '',
                    singleLegJumpRight: '',
                    singleLegWallSitLeft: '',
                    singleLegWallSitRight: '',
                    coreEnduranceLeft: '', // Changed from coreEndurance
                    coreEnduranceRight: '', // Added new field
                    bentArmHang: '',
                    bentArmHangEnabled: false,
                });

                // Close modals
                setShowModal(false);
                setShowConfirmation(false);

                // Update local state
                if (page.props.flash && page.props.flash.newAthlete) {
                    setAthletes((prevAthletes) => [...prevAthletes, page.props.flash!.newAthlete!]);
                }

                // ✅ Show success alert and reload page
                alert('Athlete successfully added!');
                window.location.reload();
            },
            onError: (errors: Record<string, string>) => {
                console.error('Form submission errors:', errors);
                const errorMessage = Object.values(errors)[0] || 'An error occurred';
                setError(errorMessage);
                setShowConfirmation(false);
            },
        });
    };

    // Cancel confirmation
    const cancelSubmit = () => {
        setShowConfirmation(false);
        setFormattedData(null);
    };

    return {
        form,
        setForm,
        showModal,
        setShowModal,
        showConfirmation,
        setShowConfirmation,
        handleChange,
        handleCheckboxChange,
        handleSubmit: handleFormSubmit,
        confirmSubmit,
        cancelSubmit,
        isSubmitting,
        error,
        formattedData,
    };
}
