import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import appCss from "../App/App.module.css";
import type { NoteTag } from "../../types/note";
interface NoteFormProps {
    onSubmit: (values: {
        title: string;
        content: string;
        tag: NoteTag; // ✅ ЗАМІНИЛИ
    }) => void;
    onClose: () => void;
}

interface FormValues {
    title: string;
    content: string;
    tag: NoteTag; // ⬅ тут строго NoteTag
}
const validationSchema = Yup.object({
    title: Yup.string().min(3).max(50).required(),
    content: Yup.string().max(500),
    tag: Yup.string()
        .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
        .required(),
});

export default function NoteForm({ onSubmit, onClose }: NoteFormProps) {
    return (
        <Formik<FormValues>
            initialValues={{
                title: "",
                content: "",
                tag: "Todo", // ✅ автоматично NoteTag
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                onSubmit(values); // ✅ тепер типи збігаються
                onClose();
            }}
        >
            <Form className={css.form}>
                <div className={css.formGroup}>
                    <label htmlFor="title">Title</label>
                    <Field name="title" className={css.input} />
                    <ErrorMessage name="title" component="span" className={css.error} />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="content">Content</label>
                    <Field as="textarea" name="content" className={css.textarea} />
                    <ErrorMessage name="content" component="span" className={css.error} />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="tag">Tag</label>
                    <Field as="select" name="tag" className={css.select}>
                        <option value="Todo">Todo</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Shopping">Shopping</option>
                    </Field>
                </div>

                <div className={css.actions}>
                    <button type="button" onClick={onClose} className={css.cancelButton}>
                        Cancel
                    </button>
                    <button type="submit" className={appCss.button}>
                        Create note +
                    </button>
                </div>
            </Form>
        </Formik>
    );
}