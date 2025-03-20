import { useState } from 'react';
import { router } from '@inertiajs/react';

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

    // Format form data for submission
    const formatFormData = () => {
        // Create a structured object to match the expected backend format
        const formattedData = {
            username: form.username,
            parent_email: form.parentEmail, // Using snake_case for backend
            password: form.password,
            training_results: {
                standing_long_jump: form.standingLongJump === '' ? null : Number(form.standingLongJump),
                single_leg_jump_left: form.singleLegJumpLeft === '' ? null : Number(form.singleLegJumpLeft),
                single_leg_jump_right: form.singleLegJumpRight === '' ? null : Number(form.singleLegJumpRight),
                wall_sit: form.wallSit === '' ? null : Number(form.wallSit),
                core_endurance: form.coreEndurance === '' ? null : Number(form.coreEndurance),
                bent_arm_hang: form.bentArmHang === '' ? null : Number(form.bentArmHang),
            }
        };

        return formattedData;
    };

    // Using Inertia.js for form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        router.post('/admin/athletes', formatFormData(), {
            onStart: () => setIsSubmitting(true),
            onFinish: () => setIsSubmitting(false),
            onSuccess: (page: InertiaPage) => {
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
                    setAthletes([...athletes, page.props.flash.newAthlete]);
                }
            },
            onError: (errors: Record<string, string>) => {
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
