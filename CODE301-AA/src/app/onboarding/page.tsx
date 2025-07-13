'use client';
import React from 'react';
import { Button } from '@/components/ui/button';

export default function Onboarding() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-neutral-50 group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#141414] tracking-light text-[32px] font-bold leading-tight min-w-72">Registro de emprendimiento</p>
            </div>
            <div className="flex flex-col gap-4 p-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium">Nombre del proyecto</span>
                <input
                  type="text"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border-none bg-[#ededed] focus:border-none h-10 placeholder:text-neutral-500 px-4 text-base font-normal leading-normal"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium">Descripción del proyecto</span>
                <textarea
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border-none bg-[#ededed] focus:border-none h-24 placeholder:text-neutral-500 px-4 py-2 text-base font-normal leading-normal"
                ></textarea>
              </label>
              <Button>Enviar postulación</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
