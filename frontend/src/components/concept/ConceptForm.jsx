
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Button from '../common/Button';
import Input from '../common/Input';
import { CATEGORIES, DIFFICULTY_LEVELS, QUESTION_TYPES } from '../../utils/constants';

const ConceptSchema = Yup.object().shape({
  prompt: Yup.string()
    .min(10, 'Prompt must be at least 10 characters')
    .required('Prompt is required'),
  response: Yup.string()
    .min(15, 'Response must be at least 15 characters')
    .required('Response is required'),
  metadata: Yup.object().shape({
    concept: Yup.string().required('Concept title is required'),
    category: Yup.string().required('Category is required'),
    subcategory: Yup.string(),
    difficulty: Yup.string().oneOf(DIFFICULTY_LEVELS).required('Difficulty is required'),
    question_type: Yup.string().oneOf(QUESTION_TYPES).required('Question type is required'),
  }),
});

export default function ConceptForm({
  initialValues = null,
  onSubmit,
  onCancel,
  submitText = 'Save Concept',
  loading = false,
}) {
  const defaultValues = {
    prompt: '',
    response: '',
    metadata: {
      concept: '',
      category: CATEGORIES[0],
      subcategory: '',
      difficulty: 'beginner',
      question_type: 'conceptual',
      languages: '',
      cloud_platforms: '',
      technologies: '',
      patterns_covered: '',
    },
    ...initialValues,
  };

  if (initialValues) {
    const processArrayField = (field) => {
      if (Array.isArray(field)) return field.join(', ');
      return field || '';
    };
    defaultValues.metadata = {
      ...defaultValues.metadata,
      languages: processArrayField(initialValues.metadata?.languages),
      cloud_platforms: processArrayField(initialValues.metadata?.cloud_platforms),
      technologies: processArrayField(initialValues.metadata?.technologies),
      patterns_covered: processArrayField(initialValues.metadata?.patterns_covered),
    };
  }

  const handleSubmitForm = (values) => {
    const processStringField = (str) => {
      if (!str) return [];
      return str
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    };

    const formattedValues = {
      ...values,
      metadata: {
        ...values.metadata,
        languages: processStringField(values.metadata.languages),
        cloud_platforms: processStringField(values.metadata.cloud_platforms),
        technologies: processStringField(values.metadata.technologies),
        patterns_covered: processStringField(values.metadata.patterns_covered),
      },
    };

    onSubmit(formattedValues);
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={ConceptSchema}
      onSubmit={handleSubmitForm}
      enableReinitialize
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
        <Form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title / Concept */}
            <Input
              label="Concept Title"
              name="metadata.concept"
              value={values.metadata.concept}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.metadata?.concept}
              touched={touched.metadata?.concept}
              required
              placeholder="e.g. Rate Limiting Algorithms"
            />

            {/* Category */}
            <div className="w-full">
              <label htmlFor="metadata.category" className="caia-label">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="metadata.category"
                name="metadata.category"
                value={values.metadata.category}
                onChange={handleChange}
                onBlur={handleBlur}
                className="caia-input bg-slate-950/80 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <Input
              label="Subcategory"
              name="metadata.subcategory"
              value={values.metadata.subcategory}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.metadata?.subcategory}
              touched={touched.metadata?.subcategory}
              placeholder="e.g. Traffic Management"
            />

            {/* Difficulty */}
            <div className="w-full">
              <label htmlFor="metadata.difficulty" className="caia-label">
                Difficulty <span className="text-rose-500">*</span>
              </label>
              <select
                id="metadata.difficulty"
                name="metadata.difficulty"
                value={values.metadata.difficulty}
                onChange={handleChange}
                onBlur={handleBlur}
                className="caia-input bg-slate-950/80 cursor-pointer"
              >
                {DIFFICULTY_LEVELS.map((level) => (
                  <option key={level} value={level} className="bg-slate-900 text-white">
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Question Type */}
            <div className="w-full">
              <label htmlFor="metadata.question_type" className="caia-label">
                Question Type <span className="text-rose-500">*</span>
              </label>
              <select
                id="metadata.question_type"
                name="metadata.question_type"
                value={values.metadata.question_type}
                onChange={handleChange}
                onBlur={handleBlur}
                className="caia-input bg-slate-950/80 cursor-pointer"
              >
                {QUESTION_TYPES.map((type) => (
                  <option key={type} value={type} className="bg-slate-900 text-white">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Languages */}
            <Input
              label="Languages (comma separated)"
              name="metadata.languages"
              value={values.metadata.languages}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Go, Java, Python"
            />

            {/* Cloud Platforms */}
            <Input
              label="Cloud Platforms (comma separated)"
              name="metadata.cloud_platforms"
              value={values.metadata.cloud_platforms}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. AWS, GCP"
            />

            {/* Technologies */}
            <Input
              label="Technologies (comma separated)"
              name="metadata.technologies"
              value={values.metadata.technologies}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Redis, Token Bucket, Nginx"
            />

            {/* Patterns Covered */}
            <Input
              label="Patterns Covered (comma separated)"
              name="metadata.patterns_covered"
              value={values.metadata.patterns_covered}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Sidecar, Gateway"
            />
          </div>

          {/* Prompt */}
          <div>
            <label htmlFor="prompt" className="caia-label">
              Prompt <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="prompt"
              name="prompt"
              rows={4}
              value={values.prompt}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter the system design question or prompt..."
              className={`caia-input min-h-[100px] resize-y ${
                errors.prompt && touched.prompt ? 'caia-input-error' : ''
              }`}
            />
            {errors.prompt && touched.prompt && (
              <p className="caia-error-text">{errors.prompt}</p>
            )}
          </div>

          {/* Response */}
          <div>
            <label htmlFor="response" className="caia-label">
              Response (Markdown supported) <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="response"
              name="response"
              rows={8}
              value={values.response}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter the comprehensive explanation response in Markdown..."
              className={`caia-input min-h-[200px] resize-y font-mono text-sm ${
                errors.response && touched.response ? 'caia-input-error' : ''
              }`}
            />
            {errors.response && touched.response && (
              <p className="caia-error-text">{errors.response}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 justify-end border-t border-white/5 pt-4 mt-6">
            {onCancel && (
              <Button variant="ghost" onClick={onCancel} disabled={loading || isSubmitting}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading || isSubmitting} className="px-6 py-2.5">
              {loading || isSubmitting ? 'Saving...' : submitText}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

