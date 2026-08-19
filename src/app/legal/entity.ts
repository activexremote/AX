// ══════════════════════════════════════════════════════════
//  Identidad del responsable del tratamiento.
//
//  ⚠︎ ActiveX FZC LLC está constituida en Emiratos Árabes Unidos, no en la UE.
//  Eso condiciona todos los textos legales: no aplica la LSSI española (que
//  vincula a prestadores establecidos en España), pero sí el RGPD por vía del
//  artículo 3.2, porque el programa se ofrece a personas que están en la Unión
//  y se comercializa en euros y en español. Ver src/app/legal/copy.ts.
//
//  Consecuencia práctica: hace falta un representante en la Unión (art. 27
//  RGPD) y su nombre y dirección tienen que figurar en la política de
//  privacidad. Sin él, el documento está incompleto.
// ══════════════════════════════════════════════════════════

export const ENTITY = {
  /** Razón social completa. */
  legalName: "ActiveX FZC LLC",
  /** Nombre comercial. */
  tradeName: "ActiveXRemote",
  /** Actividad principal declarada en la licencia. */
  activity: "Educational Consultancy",
  /** País de constitución. */
  country: "Emiratos Árabes Unidos",
  /** Domicilio social completo. */
  address:
    "Office No. BC-893273, 26th Floor, Amber Gem Tower, Sheikh Khalifa Street, Emiratos Árabes Unidos",

  // ── Pendiente de rellenar ────────────────────────────────
  /**
   * Número de licencia comercial de la zona franca. Sustituye al NIF.
   * ⚠︎ "Consultar por email" no es un identificador: la normativa europea de
   * consumo pide identificar al empresario antes de contratar. Sirve para
   * salir a producción, pero conviene poner el número real.
   */
  licenceNo: "Consultar por email",
  /** Correo de contacto general y para ejercer derechos. Imprescindible. */
  email: "activexremote@gmail.com",
  /** Teléfono de contacto. Opcional. */
  phone: "",
  /**
   * Representante en la Unión Europea designado por escrito conforme al
   * artículo 27 del RGPD, con su dirección postal en un Estado miembro donde
   * haya interesados. Es obligatorio al ofrecer servicios a personas en la UE.
   */
  euRepresentative: "ActiveX LLC",
  /** Delegado de protección de datos, si se designa. Opcional. */
  dpo: "",
  /** Dominio principal del sitio, sin protocolo. */
  domain: "activexremote.com",
} as const;

/** Lo mínimo para que los documentos sean utilizables. */
export const ENTITY_READY: boolean = Boolean(
  ENTITY.legalName && ENTITY.address && ENTITY.email && ENTITY.licenceNo,
);

/**
 * El representante en la UE es un requisito propio del RGPD, se avisa aparte.
 *
 * ⚠︎ Designado: ActiveX LLC. Falta su DIRECCIÓN POSTAL EN UN ESTADO MIEMBRO.
 * El artículo 27 del RGPD exige que el representante esté establecido en la
 * Unión, en un país donde haya interesados; una LLC no radicada en la UE no
 * cumple el requisito por mucho que se la designe. Mientras no haya dirección
 * europea, la página de privacidad sigue avisando.
 */
export const EU_REP_ADDRESS = "";
export const EU_REP_READY: boolean = Boolean(
  ENTITY.euRepresentative && EU_REP_ADDRESS,
);
