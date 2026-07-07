import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { loginUser, clearError } from '../../features/auth/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import { Psychology, Star } from '@mui/icons-material';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      toast.success(`Welcome back, ${user.username}!`);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = (values) => {
    dispatch(loginUser(values));
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
              <Star className="text-[12px]" /> 2026 Developer Ecosystem
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight mb-6">
              The Command <br />
              Center for <br />
              <span className="text-gradient">Architects.</span>
            </h1>
            
            <p className="text-text-muted text-lg font-medium leading-relaxed max-w-sm">
              Join the elite circle of software engineers mastering high-scale architecture through interactive blueprints.
            </p>
          </div>

          <div className="relative z-10 mt-12 flex items-center gap-4">
             <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-bg-app bg-slate-800" />
                ))}
             </div>
             <span className="text-xs font-bold text-text-muted">50k+ Engineers Joined</span>
          </div>
        </div>

        {/* Login Form Panel */}
        <div className="lg:col-span-7 p-12 md:p-20 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-12">
              <h2 className="text-4xl font-black text-white tracking-tighter mb-2">Sign In</h2>
              <p className="text-text-muted font-medium">
                Welcome back! Enter your access credentials.
              </p>
            </div>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, values, handleChange }) => (
                <Form className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Work Email</label>
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

                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Security Key</label>
                      <Link to="#" className="text-[10px] font-black uppercase tracking-widest text-primary-light hover:text-white transition-colors">Forgot?</Link>
                    </div>
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

                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-light text-white font-black text-lg shadow-xl shadow-primary/20 border-none transition-all hover:-translate-y-1 mt-8"
                  >
                    Authorize Access
                  </Button>

                  <div className="pt-8 text-center">
                    <p className="text-text-muted font-medium">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-white font-black hover:text-primary-light transition-colors">
                        Create Workspace
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

