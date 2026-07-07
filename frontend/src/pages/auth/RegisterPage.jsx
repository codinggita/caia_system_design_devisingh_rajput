import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { registerUser, clearError } from '../../features/auth/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import { Psychology, Star, CheckCircle, TrendingUp } from '@mui/icons-material';

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      toast.success(`Account created! Welcome, ${user.username}`);
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = (values) => {
    const { username, email, password } = values;
    dispatch(registerUser({ username, email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-app p-6 relative overflow-hidden">
      {/* Premium Aurora Background */}
      <div className="absolute inset-0 aurora-bg -z-10" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(124,58,237,0.15),transparent_50%)]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 rounded-[3rem] overflow-hidden glass-morphism border-white/5 shadow-2xl relative z-10"
      >
        {/* Brand Side Panel */}
        <div className="lg:col-span-5 p-12 md:p-16 flex flex-col justify-between text-white relative overflow-hidden bg-white/5 border-r border-white/5">
          <div className="absolute top-0 right-0 p-12 opacity-10 -rotate-12">
            <Psychology className="text-[200px] text-primary" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <Psychology className="text-white text-2xl" />
              </div>
              <span className="font-black tracking-tighter text-white text-2xl">CACI</span>
            </div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Star className="text-[12px]" /> Master Architectural Excellence
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight mb-6">
              Start Your <br />
              Architectural <br />
              <span className="text-gradient">Legacy.</span>
            </h1>
            
            <p className="text-text-muted text-lg font-medium leading-relaxed max-w-sm">
              Create your secure workspace and begin mastering the systems that power the modern world.
            </p>
          </div>

          <div className="relative z-10 mt-12">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                   <CheckCircle className="text-success" />
                </div>
                <span className="text-sm font-bold">Secure Auth Protocols</span>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                   <TrendingUp className="text-primary-light" />
                </div>
                <span className="text-sm font-bold">Real-time Progress Sync</span>
             </div>
          </div>
        </div>

        {/* Register Form Panel */}
        <div className="lg:col-span-7 p-12 md:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-4xl font-black text-white tracking-tighter mb-2">Create Workspace</h2>
              <p className="text-text-muted font-medium">
                Join the CACI ecosystem and start learning.
              </p>
            </div>

            <Formik
              initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, values, handleChange }) => (
                <Form className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Username</label>
                      <Input
                        name="username"
                        type="text"
                        placeholder="jdoe"
                        className="bg-white/5 border-white/5 focus:border-primary/50 py-4 rounded-2xl text-white placeholder:text-text-muted transition-all"
                        value={values.username}
                        onChange={handleChange}
                        error={touched.username && errors.username}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Email</label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="name@company.com"
                        className="bg-white/5 border-white/5 focus:border-primary/50 py-4 rounded-2xl text-white placeholder:text-text-muted transition-all"
                        value={values.email}
                        onChange={handleChange}
                        error={touched.email && errors.email}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Access Key (Password)</label>
                    <Input
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="bg-white/5 border-white/5 focus:border-primary/50 py-4 rounded-2xl text-white placeholder:text-text-muted transition-all"
                      value={values.password}
                      onChange={handleChange}
                      error={touched.password && errors.password}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Verify Key</label>
                    <Input
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="bg-white/5 border-white/5 focus:border-primary/50 py-4 rounded-2xl text-white placeholder:text-text-muted transition-all"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      error={touched.confirmPassword && errors.confirmPassword}
                    />
                  </div>

                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-light text-white font-black text-lg shadow-xl shadow-primary/20 border-none transition-all hover:-translate-y-1 mt-6"
                  >
                    Initialize Workspace
                  </Button>

                  <div className="pt-6 text-center">
                    <p className="text-text-muted font-medium">
                      Already have an account?{' '}
                      <Link to="/login" className="text-white font-black hover:text-primary-light transition-colors">
                        Sign In
                      </Link>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

