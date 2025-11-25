import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Tooltip 
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    handleClose();
  };
  
  return (
    <>
      <Tooltip title={t('actions.changeLanguage')}>
        <IconButton
          onClick={handleOpen}
          aria-label={t('accessibility.languageSelector')}
          aria-haspopup="true"
          aria-expanded={Boolean(anchorEl)}
          aria-controls={Boolean(anchorEl) ? 'language-menu' : undefined}
          color="inherit"
          size="large"
        >
          <LanguageIcon />
        </IconButton>
      </Tooltip>
      
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        MenuListProps={{
          'aria-labelledby': 'language-button',
          role: 'menu',
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={language.code === i18n.language}
            aria-current={language.code === i18n.language ? 'true' : 'false'}
            role="menuitem"
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <span 
                role="img" 
                aria-label={language.name} 
                style={{ fontSize: '1.5rem' }}
              >
                {language.flag}
              </span>
            </ListItemIcon>
            <ListItemText>{language.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
