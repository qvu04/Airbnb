import { useSelector } from 'react-redux';
import { RootState } from '../../main';
import { BeatLoader } from 'react-spinners';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingPage() {
    const { isLoading } = useSelector((state: RootState) => state.loadingSlice);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 9999,
                        background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/* Loader */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <BeatLoader color="#e672b1" size={18} speedMultiplier={1.2} />
                        <motion.p
                            style={{
                                marginTop: '20px',
                                fontSize: '1.2rem',
                                fontWeight: 500,
                                color: '#e672b1',
                                letterSpacing: '1px',
                                textShadow: '0 0 8px rgba(230, 114, 177, 0.6)',
                            }}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            Đang tải...
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
