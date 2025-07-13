'use client';
import React from 'react';
import { metrics } from '../lib/db.json';

export default function AdminMetrics() {
  // In a real application, you would fetch users and their metrics
  const users = [{ id: 1, name: 'Emprendedor 1' }];

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-neutral-50 group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#141414] tracking-light text-[32px] font-bold leading-tight min-w-72">Métricas de emprendedores</p>
            </div>
            <h2 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Todos los usuarios</h2>
            <div className="px-4 py-3 @container">
              {users.map((user) => (
                <div key={user.id} className="mb-8">
                  <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">{user.name}</h3>
                  <div className="flex overflow-hidden rounded-xl border border-[#dbdbdb] bg-neutral-50 mb-4">
                    <table className="flex-1">
                      <thead>
                        <tr className="bg-neutral-50">
                          <th className="px-4 py-3 text-left text-[#141414] w-[400px] text-sm font-medium leading-normal">
                            Fecha
                          </th>
                          <th className="px-4 py-3 text-left text-[#141414] w-[400px] text-sm font-medium leading-normal">
                            Ventas
                          </th>
                          <th className="px-4 py-3 text-left text-[#141414] w-[400px] text-sm font-medium leading-normal">
                            Nuevos clientes
                          </th>
                          <th className="px-4 py-3 text-left text-[#141414] w-[400px] text-sm font-medium leading-normal">
                            Afiliados
                          </th>
                          <th className="px-4 py-3 text-left text-[#141414] w-[400px] text-sm font-medium leading-normal">
                            Gastos
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {metrics
                          .filter((metric) => metric.userId === user.id)
                          .map((row) => (
                            <tr key={row.id} className="border-t border-t-[#dbdbdb]">
                              <td className="h-[72px] px-4 py-2 w-[400px] text-neutral-500 text-sm font-normal leading-normal">
                                {row.date}
                              </td>
                              <td className="h-[72px] px-4 py-2 w-[400px] text-neutral-500 text-sm font-normal leading-normal">
                                ${row.sales.toLocaleString()}
                              </td>
                              <td className="h-[72px] px-4 py-2 w-[400px] text-neutral-500 text-sm font-normal leading-normal">
                                {row.customers}
                              </td>
                              <td className="h-[72px] px-4 py-2 w-[400px] text-neutral-500 text-sm font-normal leading-normal">
                                {row.affiliates}
                              </td>
                              <td className="h-[72px] px-4 py-2 w-[400px] text-neutral-500 text-sm font-normal leading-normal">
                                ${row.expenses.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center px-4 py-3 gap-3 @container">
                    <label className="flex flex-col min-w-40 h-12 flex-1">
                      <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                        <input
                          placeholder="Añadir observación"
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border-none bg-[#ededed] focus:border-none h-full placeholder:text-neutral-500 px-4 rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
                        />
                        <div className="flex border-none bg-[#ededed] items-center justify-center pr-4 rounded-r-xl border-l-0 !pr-2">
                          <div className="flex items-center gap-4 justify-end">
                            <div className="flex items-center gap-1"></div>
                            <button
                              onClick={() => console.log('Añadir observación')}
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
