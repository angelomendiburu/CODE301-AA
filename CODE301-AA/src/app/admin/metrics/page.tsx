'use client';
import React from 'react';

export default function AdminMetrics() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-neutral-50 group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-80">
            <div className="flex h-full min-h-[700px] flex-col justify-between bg-neutral-50 p-4">
              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDlWr8CuKTHdoj44hoT1gt9lJo_DW6Iq7Pizz8CA8fAffb0C7pOPtiMBhV3Nrjv2JTdnJswKt-e5xKtDgIGDJtIwb3FlX64h1dl5MNAPJy3k_I2n40RflPQthq_dF0wn0eYQ06Bez4Jc8-fDH2_GfXAG6bU0jLsElDvkZoiILlqKlZMclsxPiXHMDIhi5hQ9iWh6aSyK_smvsLFqZnCqtHJ3VsAcjQPxxAHyY5iLmZtpPMFHIbmGb2sQTRJT6W2XMSJF3AamC5sJg")',
                    }}
                  ></div>
                  <h1 className="text-[#141414] text-base font-medium leading-normal">GrowthTrack Pro</h1>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#141414]" data-icon="House" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"></path>
                      </svg>
                    </div>
                    <p className="text-[#141414] text-sm font-medium leading-normal">Dashboard</p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#141414]" data-icon="Users" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
                      </svg>
                    </div>
                    <p className="text-[#141414] text-sm font-medium leading-normal">Usuarios</p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#ededed]">
                    <div className="text-[#141414]" data-icon="PresentationChart" data-size="24px" data-weight="fill">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM104,144a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32,0a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"></path>
                      </svg>
                    </div>
                    <p className="text-[#141414] text-sm font-medium leading-normal">Métricas</p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#141414]" data-icon="MagnifyingGlass" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                      </svg>
                    </div>
                    <p className="text-[#141414] text-sm font-medium leading-normal">Observaciones</p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#141414]" data-icon="Gear" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
                      </svg>
                    </div>
                    <p className="text-[#141414] text-sm font-medium leading-normal">Configuración</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="text-[#141414]" data-icon="Question" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
                    </svg>
                  </div>
                  <p className="text-[#141414] text-sm font-medium leading-normal">Ayuda</p>
                </div>
              </div>
            </div>
          </div>
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#141414] tracking-light text-[32px] font-bold leading-tight min-w-72">Métricas</p>
            </div>
            <div className="px-4 py-3 @container">
              <div className="flex overflow-hidden rounded-xl border border-[#dbdbdb] bg-neutral-50">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-neutral-50">
                      <th className="table-02e1d3d5-63a3-440f-8d84-22c5e7643672-column-120 px-4 py-3 text-left text-[#141414] w-[400px] text-sm font-medium leading-normal">
                        Empresa
                      </th>
                      <th className="table-02e1d3d5-63a3-440f-8d84-22c5e7643672-column-240 px-4 py-3 text-left text-[#141414] w-[400px] text-sm font-medium leading-normal">
                        Progreso
                      </th>
                      <th className="table-02e1d3d5-63a3-440f-8d84-22c5e7643672-column-360 px-4 py-3 text-left text-[#141414] w-[400px] text-sm font-medium leading-normal">
                        Métricas Clave
                      </th>
                      <th className="table-02e1d3d5-63a3-440f-8d84-22c5e7643672-column-480 px-4 py-3 text-left text-[#141414] w-60 text-neutral-500 text-sm font-medium leading-normal">
                        Observaciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Empresa A', progress: 75, metrics: 'Ventas: $100k, Clientes: 500, Afiliados: 50' },
                      { name: 'Empresa B', progress: 50, metrics: 'Ventas: $50k, Clientes: 250, Afiliados: 25' },
                      { name: 'Empresa C', progress: 90, metrics: 'Ventas: $150k, Clientes: 750, Afiliados: 75' },
                      { name: 'Empresa D', progress: 60, metrics: 'Ventas: $80k, Clientes: 400, Afiliados: 40' },
                      { name: 'Empresa E', progress: 80, metrics: 'Ventas: $120k, Clientes: 600, Afiliados: 60' },
                    ].map((company, index) => (
                      <tr key={index} className="border-t border-t-[#dbdbdb]">
                        <td className="table-02e1d3d5-63a3-440f-8d84-22c5e7643672-column-120 h-[72px] px-4 py-2 w-[400px] text-[#141414] text-sm font-normal leading-normal">
                          {company.name}
                        </td>
                        <td className="table-02e1d3d5-63a3-440f-8d84-22c5e7643672-column-240 h-[72px] px-4 py-2 w-[400px] text-sm font-normal leading-normal">
                          <div className="flex items-center gap-3">
                            <div className="w-[88px] overflow-hidden rounded-sm bg-[#dbdbdb]">
                              <div className="h-1 rounded-full bg-black" style={{ width: `${company.progress}%` }}></div>
                            </div>
                            <p className="text-[#141414] text-sm font-medium leading-normal">{company.progress}</p>
                          </div>
                        </td>
                        <td className="table-02e1d3d5-63a3-440f-8d84-22c5e7643672-column-360 h-[72px] px-4 py-2 w-[400px] text-neutral-500 text-sm font-normal leading-normal">
                          {company.metrics}
                        </td>
                        <td className="table-02e1d3d5-63a3-440f-8d84-22c5e7643672-column-480 h-[72px] px-4 py-2 w-60 text-neutral-500 text-sm font-bold leading-normal tracking-[0.015em]">
                          Ver
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <style>
                {`
                @container(max-width:120px){.table-02e1d3d5-63a3-440f-8d84-22c5e7643672-column-120{display: none;}}
                @container(max-width:240px){.table-02e1d3d5-63a3-440f-8d84-22c5e7643672-column-240{display: none;}}
                @container(max-width:360px){.table-02e1d3d5-63a3-440f-8d84-22c5e7643672-column-360{display: none;}}
                @container(max-width:480px){.table-02e1d3d5-63a3-440f-8d84-22c5e7643672-column-480{display: none;}}
                `}
              </style>
            </div>
            <h2 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Gráficos de Progreso</h2>
            <div className="flex flex-wrap gap-4 px-4 py-6">
              <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#dbdbdb] p-6">
                <p className="text-[#141414] text-base font-medium leading-normal">Progreso de Ventas</p>
                <p className="text-[#141414] tracking-light text-[32px] font-bold leading-tight truncate">+$20k</p>
                <div className="flex gap-1">
                  <p className="text-neutral-500 text-base font-normal leading-normal">Últimos 3 meses</p>
                  <p className="text-[#078807] text-base font-medium leading-normal">+20%</p>
                </div>
                <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                  <svg width="100%" height="148" viewBox="-3 0 478 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path
                      d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z"
                      fill="url(#paint0_linear_1131_5935)"
                    ></path>
                    <path
                      d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
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
                    <p className="text-neutral-500 text-[13px] font-bold leading-normal tracking-[0.015em]">Sem 1</p>
                    <p className="text-neutral-500 text-[13px] font-bold leading-normal tracking-[0.015em]">Sem 2</p>
                    <p className="text-neutral-500 text-[13px] font-bold leading-normal tracking-[0.015em]">Sem 3</p>
                  </div>
                </div>
              </div>
              <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#dbdbdb] p-6">
                <p className="text-[#141414] text-base font-medium leading-normal">Progreso de Clientes</p>
                <p className="text-[#141414] tracking-light text-[32px] font-bold leading-tight truncate">+100</p>
                <div className="flex gap-1">
                  <p className="text-neutral-500 text-base font-normal leading-normal">Últimos 3 meses</p>
                  <p className="text-[#078807] text-base font-medium leading-normal">+25%</p>
                </div>
                <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                  {[70, 10, 60].map((height, index) => (
                    <React.Fragment key={index}>
                      <div className="border-neutral-500 bg-[#ededed] border-t-2 w-full" style={{ height: `${height}%` }}></div>
                      <p className="text-neutral-500 text-[13px] font-bold leading-normal tracking-[0.015em]">Sem {index + 1}</p>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
            <h2 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Observaciones</h2>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <textarea
                  placeholder="Escribe una observación para la empresa..."
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border border-[#dbdbdb] bg-neutral-50 focus:border-[#dbdbdb] min-h-36 placeholder:text-neutral-500 p-[15px] text-base font-normal leading-normal"
                ></textarea>
              </label>
            </div>
            <div className="flex px-4 py-3 justify-end">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-black text-neutral-50 text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Enviar Observación</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
