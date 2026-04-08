import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import type { NoteTag } from "../../types/note";

interface NoteFormProps {
    onClose: () => void;
}

interface FormValues {
    title: string;
    content: string;
    tag: NoteTag;
}

const validationSchema = Yup.object({
    title: Yup.string().min(3).max(50).required("Title is required"),
    content: Yup.string().max(500, "Content must be less than 500 characters"),
    tag: Yup.mixed<NoteTag>()
        .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
        .required("Tag is required"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            onClose();
        },
    });

    return (
        <Formik<FormValues>
            initialValues={{ title: "", content: "", tag: "Todo" }}
            validationSchema={validationSchema}
            onSubmit={(values) => mutation.mutate(values)}
        >
            <Form className={css.form}>
                <div className={css.formGroup}>
                    <label htmlFor="title" className={css.label}>Title</label>
                    <Field name="title" className={css.input} />
                    <ErrorMessage name="title" component="span" className={css.error} />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="content" className={css.label}>Content</label>
                    <Field as="textarea" name="content" className={css.textarea} />
                    <ErrorMessage name="content" component="span" className={css.error} />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="tag" className={css.label}>Tag</label>
                    <Field as="select" name="tag" className={css.select}>
                        <option value="Todo">Todo</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Shopping">Shopping</option>
                    </Field>
                    <ErrorMessage name="tag" component="span" className={css.error} />
                </div>

                <div className={css.actions}>
                    <button type="button" className={css.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className={css.submitButton}>
                        Create note +
                    </button>
                </div>
            </Form>
        </Formik>
    );
}