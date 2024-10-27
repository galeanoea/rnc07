import { assertAlmostEquals, assertEquals } from "@std/assert";
import * as main from "./main.js";

Deno.test("Probar generarEspectros contra valores calulados en js", async (t) => {
  const Ta = 0.1;
  const Tb = 0.6;
  const Tc = 2.0;
  const omega = 2;

  const S = 1;
  const a0 = 0.31;
  const d = 0.8370;
  const Q1Corregido = 4;
  const periodo = 3;
  const intervalo = 10;

  const espectros = main.generarEspectro(
    a0,
    S,
    d,
    Q1Corregido,
    periodo,
    intervalo,
  );
  await t.step("T < Ta", () => {
    const T = 0;
    const elemento = T * intervalo;

    const elasticoEsperado = S * (a0 + (d - a0) * (T / Ta));
    const reducidoEsperado = elasticoEsperado / (Q1Corregido * omega);
    const elasticoReal = espectros.elastico[elemento].a;
    const reducidoReal = espectros.reducido[elemento].a;

    assertEquals(elasticoReal, elasticoEsperado);
    assertEquals(reducidoReal, reducidoEsperado);
  });

  await t.step("Ta = T", () => {
    const T = 0.1;
    const elemento = T * intervalo;

    const elasticoEsperado = S * d;
    const reducidoEsperado = elasticoEsperado / (Q1Corregido * omega);
    const elasticoReal = espectros.elastico[elemento].a;
    const reducidoReal = espectros.reducido[elemento].a;

    assertEquals(elasticoReal, elasticoEsperado);
    assertEquals(reducidoReal, reducidoEsperado);
  });

  await t.step("Ta < T < Tb", () => {
    const T = 0.2;
    const elemento = T * intervalo;

    const elasticoEsperado = S * d;
    const reducidoEsperado = elasticoEsperado / (Q1Corregido * omega);
    const elasticoReal = espectros.elastico[elemento].a;
    const reducidoReal = espectros.reducido[elemento].a;

    assertEquals(elasticoReal, elasticoEsperado);
    assertEquals(reducidoReal, reducidoEsperado);
  });

  await t.step("Tb = T", () => {
    const T = 0.6;
    const elemento = T * intervalo;

    const elasticoEsperado = S * d;
    const reducidoEsperado = elasticoEsperado / (Q1Corregido * omega);
    const elasticoReal = espectros.elastico[elemento].a;
    const reducidoReal = espectros.reducido[elemento].a;

    assertEquals(elasticoReal, elasticoEsperado);
    assertEquals(reducidoReal, reducidoEsperado);
  });

  await t.step("Tb < T < Tc", () => {
    const T = 0.7;
    const elemento = T * intervalo;

    const elasticoEsperado = S * d * (Tb / T);
    const reducidoEsperado = elasticoEsperado / (Q1Corregido * omega);
    const elasticoReal = espectros.elastico[elemento].a;
    const reducidoReal = espectros.reducido[elemento].a;

    assertEquals(elasticoReal, elasticoEsperado);
    assertEquals(reducidoReal, reducidoEsperado);
  });

  await t.step("Tc = T", () => {
    const T = 2.0;
    const elemento = T * intervalo;

    const elasticoEsperado = S * d * (Tb / T);
    const reducidoEsperado = elasticoEsperado / (Q1Corregido * omega);
    const elasticoReal = espectros.elastico[elemento].a;
    const reducidoReal = espectros.reducido[elemento].a;

    assertEquals(elasticoReal, elasticoEsperado);
    assertEquals(reducidoReal, reducidoEsperado);
  });

  await t.step("Tc < T", () => {
    const T = 2.1;
    const elemento = T * intervalo;

    const elasticoEsperado = S * d * (Tb / Tc) * (Tc / T) ** 2;
    const reducidoEsperado = elasticoEsperado / (Q1Corregido * omega);
    const elasticoReal = espectros.elastico[elemento].a;
    const reducidoReal = espectros.reducido[elemento].a;

    assertEquals(elasticoReal, elasticoEsperado);
    assertEquals(reducidoReal, reducidoEsperado);
  });
});

Deno.test("Probar generarEspectros contra valores calulados a mano", async (t) => {
  const S = 1;
  const a0 = 0.31;
  const d = 0.8370;
  const Q1Corregido = 4;
  const periodo = 3;
  const intervalo = 10;

  const espectros = main.generarEspectro(
    a0,
    S,
    d,
    Q1Corregido,
    periodo,
    intervalo,
  );

  await t.step("T < Ta", () => {
    const T = 0;
    const elemento = T * intervalo;

    const elasticoEsperado = 0.31;
    const reducidoEsperado = 0.03875;
    const elasticoReal = espectros.elastico[elemento].a;
    const reducidoReal = espectros.reducido[elemento].a;

    assertAlmostEquals(elasticoReal, elasticoEsperado);
    assertAlmostEquals(reducidoReal, reducidoEsperado);
  });

  await t.step("Ta = T", () => {
    const T = 0.1;
    const elemento = T * intervalo;

    const elasticoEsperado = 0.837;
    const reducidoEsperado = 0.104625;
    const elasticoReal = espectros.elastico[elemento].a;
    const reducidoReal = espectros.reducido[elemento].a;

    assertAlmostEquals(elasticoReal, elasticoEsperado);
    assertAlmostEquals(reducidoReal, reducidoEsperado);
  });

  await t.step("Ta < T < Tb", () => {
    const T = 0.2;
    const elemento = T * intervalo;

    const elasticoEsperado = 0.837;
    const reducidoEsperado = 0.104625;
    const elasticoReal = espectros.elastico[elemento].a;
    const reducidoReal = espectros.reducido[elemento].a;

    assertAlmostEquals(elasticoReal, elasticoEsperado);
    assertAlmostEquals(reducidoReal, reducidoEsperado);
  });

  await t.step("Tb = T", () => {
    const T = 0.6;
    const elemento = T * intervalo;

    const elasticoEsperado = 0.837;
    const reducidoEsperado = 0.104625;
    const elasticoReal = espectros.elastico[elemento].a;
    const reducidoReal = espectros.reducido[elemento].a;

    assertAlmostEquals(elasticoReal, elasticoEsperado);
    assertAlmostEquals(reducidoReal, reducidoEsperado);
  });

  await t.step("Tb < T < Tc", () => {
    const T = 0.7;
    const elemento = T * intervalo;

    const elasticoEsperado = 0.7174285714;
    const reducidoEsperado = 0.08967857143;
    const elasticoReal = espectros.elastico[elemento].a;
    const reducidoReal = espectros.reducido[elemento].a;

    assertAlmostEquals(elasticoReal, elasticoEsperado);
    assertAlmostEquals(reducidoReal, reducidoEsperado);
  });

  await t.step("Tc = T", () => {
    const T = 2.0;
    const elemento = T * intervalo;

    const elasticoEsperado = 0.2511;
    const reducidoEsperado = 0.0313875;
    const elasticoReal = espectros.elastico[elemento].a;
    const reducidoReal = espectros.reducido[elemento].a;

    assertAlmostEquals(elasticoReal, elasticoEsperado);
    assertAlmostEquals(reducidoReal, reducidoEsperado);
  });

  await t.step("Tc < T", () => {
    const T = 2.1;
    const elemento = T * intervalo;

    const elasticoEsperado = 0.227755102;
    const reducidoEsperado = 0.02846938776;
    const elasticoReal = espectros.elastico[elemento].a;
    const reducidoReal = espectros.reducido[elemento].a;

    assertAlmostEquals(elasticoReal, elasticoEsperado);
    assertAlmostEquals(reducidoReal, reducidoEsperado);
  });
});
