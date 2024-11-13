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
 * @param {string} grupo Grupo al que pertenece la estructura
 * @return {number}
 */
export function correcionA0(a0, grupo) {
  if (grupo === "a") {
    return a0 * 1.5;
  }

  return a0;
}

/**
 * Calcular la amplificación por tipo de suelo (S)
 * @param {string} zona Zona sismica
 * @param {string} suelo Tipo de suelo
 * @return {number}
 */
export function S(zona, suelo) {
  // NOTE para suelos de tipo IV es necesario realizar espectros de diseño de sitio especificio
  let S = 0;
  switch (suelo) {
    case ("III"):
      if (zona === "A") S = 2.4;
      if (zona === "B") S = 2.2;
      if (zona === "C") S = 2.0;
      break;
    case ("II"):
      if (zona === "A") S = 1.8;
      if (zona === "B") S = 1.7;
      if (zona === "C") S = 1.5;
      break;
    // Para suelos tipo I el valor de S siempre es 1, no importa la zona sísmica
    default:
      S = 1;
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
 * Calcular la reducción del espectro para el punto dado
 * @param {number} val Valor del espectro elástico para el punto (T) actual
 * @param {number} Q1 Factor de reducción por comportamiento dúctil de una estructura
 * @return {number}
 */
function reducirValorActual(val, Q1) {
  return val / (Q1 * omega);
}

/**
 * @typedef {object} ValorEspectro
 * @property {number} T
 * @property {number} a
 */

/**
 * Generador de espectros de diseño
 * @param {number} a0 Acelación máxima del terreno
 * @param {number} S Amplificación por tipo de suelo
 * @param {number} d
 * @param {number} Q1Corregido Corrección por irregularidad
 * @param {number} periodo Los segundos para los que cuales se
 * @param {number} intervalo La cantidad de calculos que se realizaran por segundo (T)
 * @return {{elastico: ValorEspectro[], reducido: ValorEspectro[]}}
 */
export function generarEspectro(a0, S, d, Q1Corregido, periodo, intervalo) {
  const muestra = periodo * intervalo;
  /** @type ValorEspectro[] */
  const elastico = new Array(muestra);
  /** @type ValorEspectro[] */
  const reducido = new Array(muestra);
  for (let i = 0; i <= muestra; i++) {
    let res = 0;
    const T = i / intervalo;

    if (T < Ta) {
      res = S * (a0 + (d - a0) * (T / Ta));
    } else if (Ta <= T && T <= Tb) {
      res = S * d;
    } else if (Tb <= T && T <= Tc) {
      res = S * d * (Tb / T);
    } else {
      res = S * d * (Tb / Tc) * (Tc / T) ** 2;
    }

    elastico[i] = { T, a: res };
    reducido[i] = {
      T,
      a: reducirValorActual(res, Q1Corregido),
    };
  }

  return { elastico, reducido };
}
