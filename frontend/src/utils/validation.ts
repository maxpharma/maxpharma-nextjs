import * as Yup from 'yup';

const contactFormSchema = Yup.object({
    name: Yup.string()
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name must be less than 50 characters')
        .required('Name is required'),

    phone: Yup.string().required('Phone number is required'),

    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),

    subject: Yup.string()
        .min(5, 'Subject must be at least 5 characters')
        .max(100, 'Subject must be less than 100 characters')
        .required('Subject is required'),

    message: Yup.string()
        .min(10, 'Message must be at least 10 characters')
        .max(500, 'Message must be less than 500 characters')
        .required('Message is required'),
});

const shareRequestSchema = Yup.object({
    name: Yup.string()
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name must be less than 50 characters')
        .required('Name is required'),

    phone: Yup.string()
    .required('Phone number is required'),
});

const validation = {
    contactFormSchema,
    shareRequestSchema,
};

export default validation;
