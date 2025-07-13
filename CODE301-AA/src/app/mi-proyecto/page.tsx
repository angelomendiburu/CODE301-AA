'use client';
import React from 'react';
import { metrics, observations } from '../lib/db.json';

export default function MiProyecto() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-neutral-50 group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#141414] tracking-light text-[32px] font-bold leading-tight min-w-72">Bienvenido de nuevo, emprendedor</p>
            </div>
            <h2 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Métricas empresariales de hoy</h2>
            <div className="px-4 py-3 @container">
              <div className="flex overflow-hidden rounded-xl border border-[#dbdbdb] bg-neutral-50">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-neutral-50">
                      <th className="table-ccbf0877-132d-4437-bef4-62b7ab69afb7-column-120 px-4 py-3 text-left text-[#141414] w-[400px] text-sm font-medium leading-normal">
                        Fecha
                      </th>
                      <th className="table-ccbf0877-132d-4437-bef4-62b7ab69afb7-column-240 px-4 py-3 text-left text-[#141414] w-[400px] text-sm font-medium leading-normal">
                        Ventas
                      </th>
                      <th className="table-ccbf0877-132d-4437-bef4-62b7ab69afb7-column-360 px-4 py-3 text-left text-[#141414] w-[400px] text-sm font-medium leading-normal">
                        Nuevos clientes
                      </th>
                      <th className="table-ccbf0877-132d-4437-bef4-62b7ab69afb7-column-480 px-4 py-3 text-left text-[#141414] w-[400px] text-sm font-medium leading-normal">
                        Afiliados
                      </th>
                      <th className="table-ccbf0877-132d-4437-bef4-62b7ab69afb7-column-600 px-4 py-3 text-left text-[#141414] w-[400px] text-sm font-medium leading-normal">
                        Gastos
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map((row) => (
                      <tr key={row.id} className="border-t border-t-[#dbdbdb]">
                        <td className="table-ccbf0877-132d-4437-bef4-62b7ab69afb7-column-120 h-[72px] px-4 py-2 w-[400px] text-neutral-500 text-sm font-normal leading-normal">
                          {row.date}
                        </td>
                        <td className="table-ccbf0877-132d-4437-bef4-62b7ab69afb7-column-240 h-[72px] px-4 py-2 w-[400px] text-neutral-500 text-sm font-normal leading-normal">
                          ${row.sales.toLocaleString()}
                        </td>
                        <td className="table-ccbf0877-132d-4437-bef4-62b7ab69afb7-column-360 h-[72px] px-4 py-2 w-[400px] text-neutral-500 text-sm font-normal leading-normal">
                          {row.customers}
                        </td>
                        <td className="table-ccbf0877-132d-4437-bef4-62b7ab69afb7-column-480 h-[72px] px-4 py-2 w-[400px] text-neutral-500 text-sm font-normal leading-normal">
                          {row.affiliates}
                        </td>
                        <td className="table-ccbf0877-132d-4437-bef4-62b7ab69afb7-column-600 h-[72px] px-4 py-2 w-[400px] text-neutral-500 text-sm font-normal leading-normal">
                          ${row.expenses.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex px-4 py-3 justify-end">
              <button
                onClick={() => console.log('Añadir métricas')}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-black text-neutral-50 text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Añadir métricas</span>
              </button>
            </div>
            <h2 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Resumen del progreso</h2>
            <div className="flex flex-wrap gap-4 px-4 py-6">
              <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#dbdbdb] p-6">
                <p className="text-[#141414] text-base font-medium leading-normal">Ventas a lo largo del tiempo</p>
                <p className="text-[#141414] tracking-light text-[32px] font-bold leading-tight truncate">
                  ${metrics[metrics.length - 1].sales.toLocaleString()}
                </p>
                <div className="flex gap-1">
                  <p className="text-neutral-500 text-base font-normal leading-normal">Últimos 7 días</p>
                  <p className={metrics[metrics.length - 1].sales - metrics[0].sales > 0 ? 'text-green-500' : 'text-red-500'}>
                    ${(metrics[metrics.length - 1].sales - metrics[0].sales).toLocaleString()}
                  </p>
                </div>
                <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                  <svg width="100%" height="148" viewBox="-3 0 478 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path
                      d={`M0 ${150 - (metrics[0].sales / 200)} C ${metrics
                        .slice(1)
                        .map(
                          (metric, index) =>
                            `${(index + 1) * 67} ${150 - (metric.sales / 200)}`
                        )
                        .join(' ')}`}
                      fill="url(#paint0_linear_1131_5935)"
                    ></path>
                    <path
                      d={`M0 ${150 - (metrics[0].sales / 200)} C ${metrics
                        .slice(1)
                        .map(
                          (metric, index) =>
                            `${(index + 1) * 67} ${150 - (metric.sales / 200)}`
                        )
                        .join(' ')}`}
                      stroke="#737373"
                      strokeWidth="3"
                      strokeLinecap="round"
                    ></path>
                    <defs>
                      <linearGradient id="paint0_linear_1131_5935" x1="236" y1="1" x2="236" y2="149" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#ededed"></stop>
                        <stop offset="1" stopColor="#ededed" stopOpacity="0"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="flex justify-around">
                    {metrics.map((metric, index) => (
                      <p key={index} className="text-neutral-500 text-[13px] font-bold leading-normal tracking-[0.015em]">
                        Día {index + 1}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#dbdbdb] p-6">
                <p className="text-[#141414] text-base font-medium leading-normal">Nuevos clientes a lo largo del tiempo</p>
                <p className="text-[#141414] tracking-light text-[32px] font-bold leading-tight truncate">
                  {metrics[metrics.length - 1].customers}
                </p>
                <div className="flex gap-1">
                  <p className="text-neutral-500 text-base font-normal leading-normal">Últimos 7 días</p>
                  <p
                    className={
                      metrics[metrics.length - 1].customers - metrics[0].customers > 0 ? 'text-green-500' : 'text-red-500'
                    }
                  >
                    {metrics[metrics.length - 1].customers - metrics[0].customers}
                  </p>
                </div>
                <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                  {metrics.map((metric, index) => (
                    <React.Fragment key={index}>
                      <div
                        className="border-neutral-500 bg-[#ededed] border-t-2 w-full"
                        style={{ height: `${(metric.customers / 30) * 100}%` }}
                      ></div>
                      <p className="text-neutral-500 text-[13px] font-bold leading-normal tracking-[0.015em]">Día {index + 1}</p>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 p-4">
              <div className="flex gap-6 justify-between">
                <p className="text-[#141414] text-base font-medium leading-normal">Objetivo de ventas semanal</p>
                <p className="text-[#141414] text-sm font-normal leading-normal">75%</p>
              </div>
              <div className="rounded bg-[#dbdbdb]">
                <div className="h-2 rounded bg-black" style={{ width: '75%' }}></div>
              </div>
              <p className="text-neutral-500 text-sm font-normal leading-normal">$30,000/$40,000</p>
            </div>
            <h2 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Observaciones</h2>
            {observations.map((observation) => (
              <div key={observation.id} className="flex w-full flex-row items-start justify-start gap-3 p-4">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAE-_VfE1pXyuiFDz1a9vqHqJ0y-wvNzTxvN06Bs1neBuTFgdpgZ8n1Obde3O3B8ed2j_ZsmdvhWL1WfmBXOQEa5v0xG-iR76gc6hYDNeF8bUgN70cK4wLzdDnM0Lusp6R_RVdPCMnOnwirF6wZ2v7PhSFBCVSPtZ0kduh8TIhalNN_93R9HhXoQVxkHpjqjdP5sLZ3SRaIgJx6Z29DmRfa76ZB79sjantmS3te4WJeVsndlph7n22LDdkdFkXss0KE5-tHOFNalg")',
                  }}
                ></div>
                <div className="flex h-full flex-1 flex-col items-start justify-start">
                  <div className="flex w-full flex-row items-start justify-start gap-x-3">
                    <p className="text-[#141414] text-sm font-bold leading-normal tracking-[0.015em]">{observation.adminName}</p>
                    <p className="text-neutral-500 text-sm font-normal leading-normal">{observation.date}</p>
                  </div>
                  <p className="text-[#141414] text-sm font-normal leading-normal">{observation.text}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center px-4 py-3 gap-3 @container">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida/public/AB6AXuAg6VEq8Wk1EhmOq7Uo75paWi5rgaZ_SkiVv0L7fYk5VNZIjkEoOVVPaozw6nbk85fOHVr1IZqJpU-wX0vky6ZUaIoK6WHxzm-evNUKYZzjOQj_-Pkkeaozs2PkphsZeVKPkdU6gYRF0pGE-a5hj_UWBuOeatW3kK4ndFrMN_shRiyk0VGvXcEvwSGyPXq30N4WCjsIdJxW3nEIu1av-3U5aD-SoMzIb_f9pcKpnBvww38sQbekLrD9GkY2OTmqpXLHtjvVGwTHtw")',
                }}
              ></div>
              <label className="flex flex-col min-w-40 h-12 flex-1">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                  <input
                    placeholder="Responder a la observación"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border-none bg-[#ededed] focus:border-none h-full placeholder:text-neutral-500 px-4 rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
                  />
                  <div className="flex border-none bg-[#ededed] items-center justify-center pr-4 rounded-r-xl border-l-0 !pr-2">
                    <div className="flex items-center gap-4 justify-end">
                      <div className="flex items-center gap-1"></div>
                      <button
                        onClick={() => console.log('Enviar observación')}
                        className="min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-black text-neutral-50 text-sm font-medium leading-normal hidden @[480px]:block"
                      >
                        <span className="truncate">Enviar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
