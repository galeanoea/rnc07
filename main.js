/**
 * @license
 * Copyright (c) 2024 Galeano Engineering & Architecture.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Valor del periodo estructural  que limita la parte ascendente del espectro de diseño
 * @constant
 * @type {number}
 * @default
 */
const Ta = 0.1;

/**
 * Valor del periodo estructural que limita la parte plana del espectro de diseño
 * @constant
 * @type {number}
 * @default
 */
const Tb = 0.6;

/**
 * Valor del periodo estructural que define un cambio en el régimen descendente del espectro de diseño
 * @constant
 * @type {number}
 * @default
 */
const Tc = 2.0;

/**
 * Factor de reducción por sobrerresistencia
 * @constant
 * @type {number}
 * @default
 */
const omega = 2;

/**
 * Calcular la acelaración máxima del terreno (a0)
 * @description Corresponde a la aceleración máxima cuando T = 0
 * @param {number} a0 Isoaceleración
 * @return {number}
 */
export function correcionA0(a0) {
  return a0 * 1.5;
}

/**
 * Obtener Factor de Amplificación por Tipo de Suelo (S), tabla de valores dados
 * @param {string} zona Zona sismica
 * @param {string} suelo Tipo de suelo
 * @return {number | undefined}
 */
export function S(zona, suelo) {
  // NOTE para suelos de tipo IV es necesario realizar espectros de diseño de sitio específico
  let S;
  const zonaMinus = zona.toLowerCase();

  switch (suelo) {
    case ("III"):
      if (zonaMinus === "a") S = 2.4;
      if (zonaMinus === "b") S = 2.2;
      if (zonaMinus === "c") S = 2.0;
      break;
    case ("II"):
      if (zonaMinus === "a") S = 1.8;
      if (zonaMinus === "b") S = 1.7;
      if (zonaMinus === "c") S = 1.5;
      break;
    case ("I"):
      if (zonaMinus === "a" || zonaMinus === "b" || zonaMinus === "c") S = 1;
      break;
    default:
      break;
  }

  return S;
}

/**
 * Calcular el Factor de Reducción por comportamiento dúctil de una estructura (Q1)
 * @param {number} Q Capacidad dúctil de una estructura
 * @return {number}
 */
export function Q1(Q) {
  // if (T <= Ta) {
  //   Q1 = 1 + (T / Ta) * (Q - 1);
  // }

  // NOTE T es desconocido o T > Ta
  return Q;
}

/**
 * Aplicar corrección por irregularidad
 * @param {number} Q1 Factor de reducción por comportamiento dúctil de una estructura
 * @param {number} FI Factor de irregularidad basado en los requisitos de regularidad
 * @return {number}
 */
export function correccionIrregularidad(Q1, FI) {
  return Q1 * FI;
}

/**
 * Calcular d
 * @param {number} a0 Aceleración máxima del terreno
 * @return {number}
 */
export function d(a0) {
  return 2.7 * a0;
}

/**
 * Calcular Aceleración para Diseño Sísmico (a), para T < Ta
 * @param {number} S Amplificación por tipo de suelo
 * @param {number} a0 Aceleración máxima del terreno
 * @param {number} d
 * @param {number} T Periodo estrucutral
 * @return {number}
 */
export function aParaTMenorTa(S, a0, d, T) {
  return S * (a0 + (d - a0) * (T / Ta));
}

/**
 * Calcular Aceleración para Diseño Sísmico (a), para Ta <= T <= Tb
 * @param {number} S Amplificación por tipo de suelo
 * @param {number} d
 * @return {number}
 */
export function aParaTMayorTaMenorTb(S, d) {
  return S * d;
}

/**
 * Calcular Aceleración para Diseño Sísmico (a), para Tb <= T <= Tc
 * @param {number} S Amplificación por tipo de suelo
 * @param {number} d
 * @param {number} T Periodo estructural
 * @return {number}
 */
export function aParaTMayorTbMenorTc(S, d, T) {
  return S * d * (Tb / T);
}

/**
 * Calcular Aceleración para Diseño Sísmico (a), para Tc < T
 * @param {number} S Amplificación por tipo de suelo
 * @param {number} d
 * @param {number} T Periodo estructural
 * @return {number}
 */
export function aParaTMayorTc(S, d, T) {
  return S * d * (Tb / Tc) * (Tc / T) ** 2;
}

/**
 * Calcular la reducción del espectro para el valor de "a" dado
 * @param {number} val Valor del espectro elástico para el punto (T) actual
 * @param {number} Q1 Factor de reducción por comportamiento dúctil de una estructura
 * @return {number}
 */
export function reducirValorA(val, Q1) {
  return val / (Q1 * omega);
}
