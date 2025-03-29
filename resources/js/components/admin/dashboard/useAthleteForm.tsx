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
    coreEndurance: string;
    bentArmHang: string;
    bentArmHangEnabled: boolean;
    [key: string]: string | number | boolean | undefined;
}

// Define interface for the formatted form data to fix TypeScript errors
interface FormattedData {
    username: string;
    parent_email: string;
    password: string;
    standing_long_jump: number | null;
    single_leg_jump_left: number | null;
    single_leg_jump_right: number | null;
    single_leg_wall_sit_left: number | null;
    single_leg_wall_sit_right: number | null;
    core_endurance: number | null;
    bent_arm_hang: number | null;
    bent_arm_enabled: boolean;
    training_results: {
        standing_long_jump: number | null;
        single_leg_jump_left: number | null;
        single_leg_jump_right: number | null;
        single_leg_wall_sit_left: number | null;
        single_leg_wall_sit_right: number | null;
        core_endurance: number | null;
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
        coreEndurance: '',
        bentArmHang: '',
        bentArmHangEnabled: false,
    });

    // Modal state
    const [showModal, setShowModal] = useState(false);

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
        const coreEndurance = form.coreEndurance === '' ? null : Number(form.coreEndurance);

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
            core_endurance: coreEndurance,
            bent_arm_hang: bentArmHang,

            // Add nested structure for controller processing
            training_results: {
                standing_long_jump: standingLongJump,
                single_leg_jump_left: singleLegJumpLeft,
                single_leg_jump_right: singleLegJumpRight,
                single_leg_wall_sit_left: singleLegWallSitLeft,
                single_leg_wall_sit_right: singleLegWallSitRight,
                core_endurance: coreEndurance,
                bent_arm_hang: bentArmHang,
            },
        };

        console.log('Formatted form data:', formData);
        return formData;
    };

    // Using Inertia.js for form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        // Format the data
        const formData = formatFormData();

        // DEBUG: Log the full form data
        console.log('FULL FORM DATA:', JSON.stringify(formData, null, 2));

        router.post('/admin/athletes', formData, {
            onStart: () => {
                console.log('Form submission starting!');
                setIsSubmitting(true);
            },
            onFinish: () => {
                console.log('Form submission finished!');
                setIsSubmitting(false);
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
                    coreEndurance: '',
                    bentArmHang: '',
                    bentArmHangEnabled: false,
                });

                // Close modal
                setShowModal(false);

                // If there's a new athlete in the response, update the local state
                if (page.props.flash && page.props.flash.newAthlete) {
                    setAthletes((prevAthletes) => [...prevAthletes, page.props.flash!.newAthlete!]);
                }

                // Show success alert and refresh the page when user clicks "OK"
                setTimeout(() => {
                    // Display alert with success message
                    alert(`Athlete ${formData.username} has been successfully added!`);

                    // Force a hard refresh of the page after alert is dismissed
                    window.location.reload();
                }, 300);
            },
            onError: (errors: Record<string, string>) => {
                console.error('Form submission errors:', errors);
                const errorMessage = Object.values(errors)[0] || 'An error occurred';
                setError(errorMessage);
            },
        });
    };

    return {
        form,
        setForm,
        showModal,
        setShowModal,
        handleChange,
        handleCheckboxChange,
        handleSubmit,
        isSubmitting,
        error,
    };
}
