import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

const SkipLink = styled('a')(({ theme }) => ({
  position: 'absolute',
  left: '-9999px',
  zIndex: 9999,
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  textDecoration: 'none',
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  fontSize: '1rem',
  
  '&:focus': {
    left: theme.spacing(2),
    top: theme.spacing(2),
    outline: `3px solid ${theme.palette.secondary.main}`,
    outlineOffset: '2px',
  },
}));

export default function SkipToMain() {
  const { t } = useTranslation();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <SkipLink 
      href="#main-content"
      onClick={handleClick}
      tabIndex={0}
    >
      {t('accessibility.skipToMainContent')}
    </SkipLink>
  );
}
