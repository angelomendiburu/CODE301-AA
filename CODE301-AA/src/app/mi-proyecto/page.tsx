'use client';
import React from 'react';

export default function MiProyecto() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-neutral-50 group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#ededed] px-10 py-3">
          <div className="flex items-center gap-4 text-[#141414]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em]">StartUPC</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-[#141414] text-sm font-medium leading-normal" href="#">Resumen</a>
              <a className="text-[#141414] text-sm font-medium leading-normal" href="#">Progreso</a>
              <a className="text-[#141414] text-sm font-medium leading-normal" href="#">Métricas</a>
              <a className="text-[#141414] text-sm font-medium leading-normal" href="#">Comunidad</a>
            </div>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#ededed] text-[#141414] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
              <div className="text-[#141414]" data-icon="Bell" data-size="20px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
                </svg>
              </div>
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDA0WYeWRsfQOgAk6NNSpjskrDNPQJcTO2J1RFBvlGm16lapV69x3rEuTF9yLUu6QqLVSpBfr-5dDz1OjGhobiPQ82RrZLzrCPzjmPsH8p8RVVddaUxB7vVvZ6hv97yemdN1hOR6d2JiHI443DJ3Sg8427ZHw7YURfejBvKrYccfXt-CBAPGHrytKLImV5mrJFYLzQLVJliY3eWwAbMOs-yGCz_ZdjIwmYA9Xwfja4RV5ApNyYf868-TUqghN-4YxEEJfeJ4mDNXA")',
              }}
            ></div>
          </div>
        </header>
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
                    {[
                      { date: '2024-01-01', sales: '$15,000', customers: '20', affiliates: '5', expenses: '$2,000' },
                      { date: '2024-01-02', sales: '$15,100', customers: '22', affiliates: '6', expenses: '$2,100' },
                      { date: '2024-01-03', sales: '$15,050', customers: '21', affiliates: '5', expenses: '$2,050' },
                      { date: '2024-01-04', sales: '$15,000', customers: '20', affiliates: '5', expenses: '$2,000' },
                      { date: '2024-01-05', sales: '$14,950', customers: '19', affiliates: '4', expenses: '$1,950' },
                      { date: '2024-01-06', sales: '$14,900', customers: '18', affiliates: '4', expenses: '$1,900' },
                      { date: '2024-01-07', sales: '$14,850', customers: '17', affiliates: '3', expenses: '$1,850' },
                    ].map((row, index) => (
                      <tr key={index} className="border-t border-t-[#dbdbdb]">
                        <td className="table-ccbf0877-132d-4437-bef4-62b7ab69afb7-column-120 h-[72px] px-4 py-2 w-[400px] text-neutral-500 text-sm font-normal leading-normal">
                          {row.date}
                        </td>
                        <td className="table-ccbf0877-132d-4437-bef4-62b7ab69afb7-column-240 h-[72px] px-4 py-2 w-[400px] text-neutral-500 text-sm font-normal leading-normal">
                          {row.sales}
                        </td>
                        <td className="table-ccbf0877-132d-4437-bef4-62b7ab69afb7-column-360 h-[72px] px-4 py-2 w-[400px] text-neutral-500 text-sm font-normal leading-normal">
                          {row.customers}
                        </td>
                        <td className="table-ccbf0877-132d-4437-bef4-62b7ab69afb7-column-480 h-[72px] px-4 py-2 w-[400px] text-neutral-500 text-sm font-normal leading-normal">
                          {row.affiliates}
                        </td>
                        <td className="table-ccbf0877-132d-4437-bef4-62b7ab69afb7-column-600 h-[72px] px-4 py-2 w-[400px] text-neutral-500 text-sm font-normal leading-normal">
                          {row.expenses}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex px-4 py-3 justify-end">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-black text-neutral-50 text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Añadir métricas</span>
              </button>
            </div>
            <h2 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Resumen del progreso</h2>
            <div className="flex flex-wrap gap-4 px-4 py-6">
              <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#dbdbdb] p-6">
                <p className="text-[#141414] text-base font-medium leading-normal">Ventas a lo largo del tiempo</p>
                <p className="text-[#141414] tracking-light text-[32px] font-bold leading-tight truncate">$14,850</p>
                <div className="flex gap-1">
                  <p className="text-neutral-500 text-base font-normal leading-normal">Últimos 7 días</p>
                  <p className="text-[#e70808] text-base font-medium leading-normal">-$150</p>
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
                    {['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5', 'Día 6', 'Día 7'].map((date, index) => (
                      <p key={index} className="text-neutral-500 text-[13px] font-bold leading-normal tracking-[0.015em]">
                        {date}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#dbdbdb] p-6">
                <p className="text-[#141414] text-base font-medium leading-normal">Nuevos clientes a lo largo del tiempo</p>
                <p className="text-[#141414] tracking-light text-[32px] font-bold leading-tight truncate">17</p>
                <div className="flex gap-1">
                  <p className="text-neutral-500 text-base font-normal leading-normal">Últimos 7 días</p>
                  <p className="text-[#e70808] text-base font-medium leading-normal">-3</p>
                </div>
                <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                  {[30, 100, 50, 80, 90, 60, 70].map((height, index) => (
                    <React.Fragment key={index}>
                      <div className="border-neutral-500 bg-[#ededed] border-t-2 w-full" style={{ height: `${height}%` }}></div>
                      <p className="text-neutral-500 text-[13px] font-bold leading-normal tracking-[0.015em]">Dia {index + 1}</p>
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
            <div className="flex w-full flex-row items-start justify-start gap-3 p-4">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAE-_VfE1pXyuiFDz1a9vqHqJ0y-wvNzTxvN06Bs1neBuTFgdpgZ8n1Obde3O3B8ed2j_ZsmdvhWL1WfmBXOQEa5v0xG-iR76gc6hYDNeF8bUgN70cK4wLzdDnM0Lusp6R_RVdPCMnOnwirF6wZ2v7PhSFBCVSPtZ0kduh8TIhalNN_93R9HhXoQVxkHpjqjdP5sLZ3SRaIgJx6Z29DmRfa76ZB79sjantmS3te4WJeVsndlph7n22LDdkdFkXss0KE5-tHOFNalg")',
                }}
              ></div>
              <div className="flex h-full flex-1 flex-col items-start justify-start">
                <div className="flex w-full flex-row items-start justify-start gap-x-3">
                  <p className="text-[#141414] text-sm font-bold leading-normal tracking-[0.015em]">Admin</p>
                  <p className="text-neutral-500 text-sm font-normal leading-normal">2024-01-08</p>
                </div>
                <p className="text-[#141414] text-sm font-normal leading-normal">Considere centrarse en el marketing de afiliación para impulsar la adquisición de nuevos clientes.</p>
              </div>
            </div>
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
                      <button className="min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-black text-neutral-50 text-sm font-medium leading-normal hidden @[480px]:block">
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
