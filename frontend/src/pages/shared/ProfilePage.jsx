import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { profileService } from '../../services/userServices';
import { fetchProfile } from '../../features/auth/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { motion } from 'framer-motion';
import { Person, Email, Badge, Settings } from '@mui/icons-material';
import toast from 'react-hot-toast';

const ProfileSchema = Yup.object().shape({
  displayName: Yup.string().max(50, 'Display name too long').required('Display name is required'),
  bio: Yup.string().max(200, 'Bio too long'),
  avatarUrl: Yup.string().url('Invalid URL'),
  skills: Yup.string(),
  goals: Yup.string(),
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 25 } }
};

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await profileService.get();
      setProfile(response.data?.data || response.data || {});
    } catch (err) {
      toast.error('Failed to load profile details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const skillsArray = values.skills
        ? values.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
        : [];

      await profileService.update({
        ...values,
        skills: skillsArray,
      });

      dispatch(fetchProfile());
      toast.success('Profile updated successfully!');
      fetchProfileData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  const memberSince = useMemo(() => {
    const date = user?.createdAt ? new Date(user.createdAt) : new Date();
    return date.getFullYear();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-10 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="h-12 w-64 bg-white/5 animate-pulse rounded-xl" />
            <div className="h-6 w-80 bg-white/5 animate-pulse rounded-lg" />
          </div>
          <div className="h-12 w-48 bg-white/5 animate-pulse rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 h-[400px] bg-white/5 animate-pulse rounded-3xl" />
          <div className="lg:col-span-8 h-[600px] bg-white/5 animate-pulse rounded-3xl" />
        </div>
      </div>
    );
  }

  const initialValues = {
    displayName: profile?.displayName || user?.username || '',
    bio: profile?.bio || '',
    avatarUrl: profile?.avatarUrl || '',
    skills: profile?.skills?.join(', ') || '',
    goals: profile?.goals || '',
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 pb-20"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
            My <span className="text-gradient">Profile</span>
          </h1>
          <p className="text-text-muted text-lg font-medium">Manage your identity and architectural expertise.</p>
        </div>
        <div className="flex items-center gap-3 glass-morphism px-6 py-3 rounded-2xl border-white/5 shadow-xl">
          <Person className="text-primary-light" />
          <span className="text-xs font-black uppercase tracking-widest text-text-secondary">Member since {memberSince}</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Card Summary */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="flex flex-col items-center justify-center text-center inner-glow group relative overflow-hidden">
            <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light text-4xl font-black uppercase mb-6 transition-all group-hover:scale-105 group-hover:rotate-3 duration-300 shadow-lg shadow-primary/10">
              {initialValues.displayName?.[0] || 'U'}
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">{initialValues.displayName}</h3>
            <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{user?.role || 'Engineer'}</span>
            
            <p className="text-sm text-text-secondary mt-6 leading-relaxed max-w-xs italic">
              {initialValues.bio ? `"${initialValues.bio}"` : '"No bio set yet. Write something about your engineering background!"'}
            </p>

            <div className="w-full border-t border-white/5 mt-8 pt-6 space-y-4 text-left">
              <div className="flex items-center gap-3 text-sm text-text-muted font-medium">
                <Email className="text-primary-light/60 text-xl" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-muted font-medium">
                <Badge className="text-primary-light/60 text-xl" />
                <span className="capitalize">Status: <span className="text-success font-black uppercase tracking-widest ml-1">{user?.isBanned ? 'Banned' : 'Active'}</span></span>
              </div>
            </div>
          </Card>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-8">
          <Card className="p-8">
            <h4 className="text-lg font-bold text-white tracking-tight border-b border-white/5 pb-6 mb-8 flex items-center gap-2">
               <Settings className="text-primary-light text-xl" />
               Workspace Configuration
            </h4>
            
            <Formik
              initialValues={initialValues}
              validationSchema={ProfileSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                <Form className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="Identity Name"
                      name="displayName"
                      value={values.displayName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.displayName}
                      touched={touched.displayName}
                      placeholder="e.g. John Architect"
                      required
                    />

                    <Input
                      label="Avatar Protocol (URL)"
                      name="avatarUrl"
                      type="url"
                      value={values.avatarUrl}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.avatarUrl}
                      touched={touched.avatarUrl}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bio" className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Short Transmission (Bio)</label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      value={values.bio}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Tell us about your architectural journey..."
                      className={`w-full bg-white/5 border rounded-2xl p-4 text-sm text-white placeholder:text-text-muted outline-none focus:border-primary/50 transition-all resize-none min-h-[100px] ${
                        errors.bio && touched.bio ? 'border-danger' : 'border-white/5'
                      }`}
                    />
                    {errors.bio && touched.bio && <p className="text-[10px] font-bold text-danger mt-1.5 ml-1 uppercase tracking-wider">{errors.bio}</p>}
                  </div>

                  <Input
                    label="Core Skills (comma separated)"
                    name="skills"
                    value={values.skills}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.skills}
                    touched={touched.skills}
                    placeholder="e.g. Distributed Systems, Kubernetes, Go, Redis"
                  />

                  <div className="space-y-2">
                    <label htmlFor="goals" className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Mission Goals</label>
                    <textarea
                      id="goals"
                      name="goals"
                      rows={3}
                      value={values.goals}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. Master high-availability patterns for 2026 enterprise scale..."
                      className={`w-full bg-white/5 border rounded-2xl p-4 text-sm text-white placeholder:text-text-muted outline-none focus:border-primary/50 transition-all resize-none min-h-[100px] ${
                        errors.goals && touched.goals ? 'border-danger' : 'border-white/5'
                      }`}
                    />
                    {errors.goals && touched.goals && <p className="text-[10px] font-bold text-danger mt-1.5 ml-1 uppercase tracking-wider">{errors.goals}</p>}
                  </div>

                  <div className="flex justify-end pt-8 border-t border-white/5 mt-10">
                    <Button 
                      type="submit" 
                      loading={saving || isSubmitting}
                      className="px-10 py-4 bg-primary hover:bg-primary-light text-white font-black text-lg shadow-xl shadow-primary/20 border-none transition-all hover:-translate-y-1"
                    >
                      Commit Profile
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
