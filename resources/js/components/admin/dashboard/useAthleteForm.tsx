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
        wall_sit: number | null;
        core_endurance: number | null;
        bent_arm_hang: number | null;
    };
};

interface AthleteFormData {
    username: string;
    parentEmail: string;
    password: string;
    standingLongJump: string;
    singleLegJumpLeft: string;
    singleLegJumpRight: string;
    wallSit: string;
    coreEndurance: string;
    bentArmHang: string;
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
    wall_sit: number | null;
    core_endurance: number | null;
    bent_arm_hang: number | null;
    training_results: {
        standing_long_jump: number | null;
        single_leg_jump_left: number | null;
        single_leg_jump_right: number | null;
        wall_sit: number | null;
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
        wallSit: '',
        coreEndurance: '',
        bentArmHang: '',
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

    // Format form data for submission to match Laravel controller expectations
    const formatFormData = (): FormattedData => {
        // Get training result values
        const standingLongJump = form.standingLongJump === '' ? null : Number(form.standingLongJump);
        const singleLegJumpLeft = form.singleLegJumpLeft === '' ? null : Number(form.singleLegJumpLeft);
        const singleLegJumpRight = form.singleLegJumpRight === '' ? null : Number(form.singleLegJumpRight);
        const wallSit = form.wallSit === '' ? null : Number(form.wallSit);
        const coreEndurance = form.coreEndurance === '' ? null : Number(form.coreEndurance);
        const bentArmHang = form.bentArmHang === '' ? null : Number(form.bentArmHang);

        // Create the formatted data object with both flat and nested structures
        const formData: FormattedData = {
            username: form.username,
            parent_email: form.parentEmail,
            password: form.password,

            // Add flat fields for validation
            standing_long_jump: standingLongJump,
            single_leg_jump_left: singleLegJumpLeft,
            single_leg_jump_right: singleLegJumpRight,
            wall_sit: wallSit,
            core_endurance: coreEndurance,
            bent_arm_hang: bentArmHang,

            // Add nested structure for controller processing
            training_results: {
                standing_long_jump: standingLongJump,
                single_leg_jump_left: singleLegJumpLeft,
                single_leg_jump_right: singleLegJumpRight,
                wall_sit: wallSit,
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
                    wallSit: '',
                    coreEndurance: '',
                    bentArmHang: '',
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
        showModal,
        setShowModal,
        handleChange,
        handleSubmit,
        isSubmitting,
        error,
    };
}
