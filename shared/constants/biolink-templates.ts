import { MetadataBiolink } from '@/types/biolink';

export const DEFAULT_BIOLINK_TEMPLATE: MetadataBiolink = {
  titulo: 'Mi Biolink',
  descripcion: 'Bienvenido a mi perfil dinámico',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
  tema: 'LIGHT',
  colorPrincipal: '#6366f1',
  enlaces: [
    { id: '1', titulo: 'Mi Sitio Web', url: 'https://ejemplo.com', activo: true },
    { id: '2', titulo: 'Instagram', url: 'https://instagram.com', activo: true },
  ],
  redesSociales: {},
};
