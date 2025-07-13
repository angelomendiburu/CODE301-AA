'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

export default function Status() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-neutral-50 group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#141414] tracking-light text-[32px] font-bold leading-tight min-w-72">Seguimiento de postulaciones</p>
            </div>
            <div className="flex flex-col gap-4 p-4">
              <div className="flex gap-4">
                <Button variant="secondary">Incompletas</Button>
                <Button variant="secondary">Terminadas</Button>
                <Button variant="secondary">Descartadas</Button>
                <Button variant="secondary">Escogidas</Button>
              </div>
              <div className="flex flex-col gap-4 p-4">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-neutral-50">
                      <th className="px-4 py-3 text-left text-[#141414] w-[200px] text-sm font-medium leading-normal">
                        Nombre
                      </th>
                      <th className="px-4 py-3 text-left text-[#141414] w-[200px] text-sm font-medium leading-normal">
                        Proyecto
                      </th>
                      <th className="px-4 py-3 text-left text-[#141414] w-[200px] text-sm font-medium leading-normal">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-[#141414] w-[200px] text-sm font-medium leading-normal">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-t-[#dbdbdb]">
                      <td className="h-[72px] px-4 py-2 w-[200px] text-neutral-500 text-sm font-normal leading-normal">
                        Juan Perez
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[200px] text-neutral-500 text-sm font-normal leading-normal">
                        Mi Tiendita
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[200px] text-neutral-500 text-sm font-normal leading-normal">
                        Incompleta
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[200px] text-neutral-500 text-sm font-normal leading-normal">
                        <div className="flex gap-2">
                          <Button onClick={() => console.log('Enviar correo')}>Correo</Button>
                          <Button onClick={() => console.log('Enviar WhatsApp')}>WhatsApp</Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
