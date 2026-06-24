import { useState } from 'react';
import FaseGrupos from '@/components/FaseGrupos';
import TercerClasificado from '@/components/TercerClasificado';
import CuadroEliminatorio from '@/components/CuadroEliminatorio';

export default function Home({ seccion }) {
  return (
    <>
      {seccion === 'grupos' && <FaseGrupos />}
      {seccion === 'terceros' && <TercerClasificado />}
      {seccion === 'eliminatorio' && <CuadroEliminatorio />}
    </>
  );
}
