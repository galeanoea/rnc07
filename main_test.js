import { assert, assertAlmostEquals, assertEquals } from "@std/assert";
import * as main from "./main.js";

Deno.test("Calcular correcionA0, igual a valor calculado en js", () => {
  const a0 = 0.1;

  const correccionA0Espereado = a0 * 1.5;
  const correccionA0Real = main.correcionA0(a0);

  assertEquals(correccionA0Real, correccionA0Espereado);
});

Deno.test("Probar correcionA0, casi igual a valor calculado a mano con tolerancia de 0000000", () => {
  const a0 = 0.1;

  const correccionA0Espereado = 0.15;
  const correccionA0Real = main.correcionA0(a0);

  assertAlmostEquals(correccionA0Real, correccionA0Espereado);
});

Deno.test("Obtener S", async (t) => {
  await t.step("Zona A y Suelo I, devuelve 1", () => {
    const zona = "A";
    const suelo = "I";

    const sEsperado = 1;
    const sReal = main.S(zona, suelo);

    assertEquals(sReal, sEsperado);
  });

  await t.step("Zona diferente de A, B o C, devuelve undefined", () => {
    const zona = "";
    const suelo = "I";

    const s = main.S(zona, suelo);

    assert(s === undefined);
  });

  await t.step("Suelo diferente de I, II o III, devuelve undefined", () => {
    const zona = "A";
    const suelo = "";

    const s = main.S(zona, suelo);

    assert(s === undefined);
  });
});

Deno.test("Calcular Q1, devuelve el mismo número", () => {
  const Q = 1;
  const Q1 = main.Q1(Q);

  assertEquals(Q1, Q);
});

Deno.test("Calcular Ccorreccion por Irregularidad, igual a multiplicacion de ambos argumentos", () => {
  const Q1 = 2;
  const FI = 3;

  const correcionEsperada = Q1 * FI;
  const correcionReal = main.correccionIrregularidad(Q1, FI);

  assertEquals(correcionReal, correcionEsperada);
});

Deno.test("Calcular d, igual a valor calculado en js", () => {
  const a0 = 0.1;

  const dEsperada = a0 * 2.7;
  const dReal = main.d(a0);

  assertEquals(dReal, dEsperada);
});

Deno.test("Calcular d, casi igual a valor calculado a mano con tolerancia de 0000000", () => {
  const a0 = 0.1;

  const dEsperada = 0.27;
  const dReal = main.d(a0);

  assertEquals(dReal, dEsperada);
});

Deno.test(
  'Calcular "a" para diferentes valores de T, igual a valor calculado en js',
  async (t) => {
    const Ta = 0.1;
    const Tb = 0.6;
    const Tc = 2.0;
    const omega = 2;

    const S = 1;
    const a0 = 0.31;
    const d = 0.8370;
    const Q1Corregido = 4;

    await t.step("T < Ta", () => {
      const T = 0;

      const elasticoEsperado = S * (a0 + (d - a0) * (T / Ta));
      const reducidoEsperado = elasticoEsperado / (Q1Corregido * omega);
      const elasticoReal = main.aParaTMenorTa(S, a0, d, T);
      const reducidoReal = main.reducirValorA(elasticoReal, Q1Corregido);

      assertEquals(elasticoReal, elasticoEsperado);
      assertEquals(reducidoReal, reducidoEsperado);
    });

    await t.step("Ta = T", () => {
      const _T = 0.1;

      const elasticoEsperado = S * d;
      const reducidoEsperado = elasticoEsperado / (Q1Corregido * omega);
      const elasticoReal = main.aParaTMayorTaMenorTb(S, d);
      const reducidoReal = main.reducirValorA(elasticoReal, Q1Corregido);

      assertEquals(elasticoReal, elasticoEsperado);
      assertEquals(reducidoReal, reducidoEsperado);
    });

    await t.step("Ta < T < Tb", () => {
      const _T = 0.2;

      const elasticoEsperado = S * d;
      const reducidoEsperado = elasticoEsperado / (Q1Corregido * omega);
      const elasticoReal = main.aParaTMayorTaMenorTb(S, d);
      const reducidoReal = main.reducirValorA(elasticoReal, Q1Corregido);

      assertEquals(elasticoReal, elasticoEsperado);
      assertEquals(reducidoReal, reducidoEsperado);
    });

    await t.step("Tb = T", () => {
      const _T = 0.6;

      const elasticoEsperado = S * d;
      const reducidoEsperado = elasticoEsperado / (Q1Corregido * omega);
      const elasticoReal = main.aParaTMayorTaMenorTb(S, d);
      const reducidoReal = main.reducirValorA(elasticoReal, Q1Corregido);

      assertEquals(elasticoReal, elasticoEsperado);
      assertEquals(reducidoReal, reducidoEsperado);
    });

    await t.step("Tb < T < Tc", () => {
      const T = 0.7;

      const elasticoEsperado = S * d * (Tb / T);
      const reducidoEsperado = elasticoEsperado / (Q1Corregido * omega);
      const elasticoReal = main.aParaTMayorTbMenorTc(S, d, T);
      const reducidoReal = main.reducirValorA(elasticoReal, Q1Corregido);

      assertEquals(elasticoReal, elasticoEsperado);
      assertEquals(reducidoReal, reducidoEsperado);
    });

    await t.step("Tc = T", () => {
      const T = 2.0;

      const elasticoEsperado = S * d * (Tb / T);
      const reducidoEsperado = elasticoEsperado / (Q1Corregido * omega);
      const elasticoReal = main.aParaTMayorTbMenorTc(S, d, T);
      const reducidoReal = main.reducirValorA(elasticoReal, Q1Corregido);

      assertEquals(elasticoReal, elasticoEsperado);
      assertEquals(reducidoReal, reducidoEsperado);
    });

    await t.step("Tc < T", () => {
      const T = 2.1;

      const elasticoEsperado = S * d * (Tb / Tc) * (Tc / T) ** 2;
      const reducidoEsperado = elasticoEsperado / (Q1Corregido * omega);
      const elasticoReal = main.aParaTMayorTc(S, d, T);
      const reducidoReal = main.reducirValorA(elasticoReal, Q1Corregido);

      assertEquals(elasticoReal, elasticoEsperado);
      assertEquals(reducidoReal, reducidoEsperado);
    });
  },
);

Deno.test(
  'Calcular "a" para diferentes valores de T, casi igual que valor calculado a mano con tolerancia 000000',
  async (t) => {
    const S = 1;
    const a0 = 0.31;
    const d = 0.8370;
    const Q1Corregido = 4;

    await t.step("T < Ta", () => {
      const T = 0;

      const elasticoEsperado = 0.31;
      const reducidoEsperado = 0.03875;
      const elasticoReal = main.aParaTMenorTa(S, a0, d, T);
      const reducidoReal = main.reducirValorA(elasticoReal, Q1Corregido);

      assertAlmostEquals(elasticoReal, elasticoEsperado);
      assertAlmostEquals(reducidoReal, reducidoEsperado);
    });

    await t.step("Ta = T", () => {
      const _T = 0.1;

      const elasticoEsperado = 0.837;
      const reducidoEsperado = 0.104625;
      const elasticoReal = main.aParaTMayorTaMenorTb(S, d);
      const reducidoReal = main.reducirValorA(elasticoReal, Q1Corregido);

      assertAlmostEquals(elasticoReal, elasticoEsperado);
      assertAlmostEquals(reducidoReal, reducidoEsperado);
    });

    await t.step("Ta < T < Tb", () => {
      const _T = 0.2;

      const elasticoEsperado = 0.837;
      const reducidoEsperado = 0.104625;
      const elasticoReal = main.aParaTMayorTaMenorTb(S, d);
      const reducidoReal = main.reducirValorA(elasticoReal, Q1Corregido);

      assertAlmostEquals(elasticoReal, elasticoEsperado);
      assertAlmostEquals(reducidoReal, reducidoEsperado);
    });

    await t.step("Tb = T", () => {
      const _T = 0.6;

      const elasticoEsperado = 0.837;
      const reducidoEsperado = 0.104625;
      const elasticoReal = main.aParaTMayorTaMenorTb(S, d);
      const reducidoReal = main.reducirValorA(elasticoReal, Q1Corregido);

      assertAlmostEquals(elasticoReal, elasticoEsperado);
      assertAlmostEquals(reducidoReal, reducidoEsperado);
    });

    await t.step("Tb < T < Tc", () => {
      const T = 0.7;

      const elasticoEsperado = 0.7174285714;
      const reducidoEsperado = 0.08967857143;
      const elasticoReal = main.aParaTMayorTbMenorTc(S, d, T);
      const reducidoReal = main.reducirValorA(elasticoReal, Q1Corregido);

      assertAlmostEquals(elasticoReal, elasticoEsperado);
      assertAlmostEquals(reducidoReal, reducidoEsperado);
    });

    await t.step("Tc = T", () => {
      const T = 2.0;

      const elasticoEsperado = 0.2511;
      const reducidoEsperado = 0.0313875;
      const elasticoReal = main.aParaTMayorTbMenorTc(S, d, T);
      const reducidoReal = main.reducirValorA(elasticoReal, Q1Corregido);

      assertAlmostEquals(elasticoReal, elasticoEsperado);
      assertAlmostEquals(reducidoReal, reducidoEsperado);
    });

    await t.step("Tc < T", () => {
      const T = 2.1;

      const elasticoEsperado = 0.227755102;
      const reducidoEsperado = 0.02846938776;
      const elasticoReal = main.aParaTMayorTc(S, d, T);
      const reducidoReal = main.reducirValorA(elasticoReal, Q1Corregido);

      assertAlmostEquals(elasticoReal, elasticoEsperado);
      assertAlmostEquals(reducidoReal, reducidoEsperado);
    });
  },
);
