"use strict";

window.extractExtendedType = function(value) {
  // Based on https://stackoverflow.com/a/3143231 .
  const ISO_TIMESTAMP_REGEXP = /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)$/;
  const ISO_TIMESTAMP_TZ_REGEXP = /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:?[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:?[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:?[0-5]\d|Z))$/;

  function extractType() {
    if(ISO_TIMESTAMP_REGEXP.test(value) || ISO_TIMESTAMP_TZ_REGEXP.test(value)) return "timestamp";

    if(/^(ftp|file|https?|wss?):/.test(value)) {
      try {
        new URL(value);
        return "url";
      }
      catch(_) {
      }
    }

    return null;
  }

  const LABEL_MAP = {
    "timestamp": "ISO8601 Timestamp",
    "url": "URL",
    "null": null
  };

  const type = extractType();

  return {
    type: type,
    label: LABEL_MAP[type]
  };
};