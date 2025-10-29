function banderaImg(code) {
  if (code === 'ic') {
    return `<img src="images/IslasCanarias.svg" alt="Islas Canarias" title="Islas Canarias" />`;
  }
  return `<img src="https://flagcdn.com/w40/${code}.png" alt="${code}" title="${code.toUpperCase()}" />`;
}

const emojisBanderas = {
  es: "🇪🇸",
  ic: "🇮🇨",
  ar: "🇦🇷",
  uy: "🇺🇾",
  cl: "🇨🇱",
  py: "🇵🇾",
  ve: "🇻🇪",
  cu: "🇨🇺",
  do: "🇩🇴",
  pr: "🇵🇷",
  bo: "🇧🇴",
  co: "🇨🇴",
  ec: "🇪🇨",
  pa: "🇵🇦",
  pe: "🇵🇪",
  cr: "🇨🇷",
  gt: "🇬🇹",
  hn: "🇭🇳",
  mx: "🇲🇽",
  ni: "🇳🇮",
  sv: "🇸🇻",
  utc: "🗺️" // Emoji genérico para UTC
};

const zonas = [
  {
    tz: 'Europe/Madrid',
    flags: ['es'],
    paises: ['España']
  },
  {
    tz: 'UTC',
    flags: ['utc', 'ic'], // Ambas banderas juntas
    label: 'UTC / Islas Canarias',
    paises: ['Islas Canarias']
  },
  {
    tz: 'America/Argentina/Buenos_Aires',
    flags: ['ar', 'uy', 'cl', 'py'],
    paises: ['Argentina', 'Uruguay', 'Chile', 'Paraguay']
  },
  {
    tz: 'America/Caracas',
    flags: ['ve', 'bo'],
    paises: ['Venezuela', 'Bolivia']
  },
  {
    tz: 'America/Havana',
    flags: ['cu'],
    paises: ['Cuba']
  },
  {
    tz: 'America/Santo_Domingo',
    flags: ['do', 'pr'],
    paises: ['República Dominicana', 'Puerto Rico']
  },
  {
    tz: 'America/Bogota',
    flags: ['co', 'ec', 'pa', 'pe'],
    paises: ['Colombia', 'Ecuador', 'Panamá', 'Perú']
  },
  {
    tz: 'America/Mexico_City',
    flags: ['cr', 'gt', 'hn', 'mx', 'ni', 'sv'],
    paises: ['Costa Rica', 'Guatemala', 'Honduras', 'México', 'Nicaragua', 'El Salvador']
  }
];

const formulario = document.getElementById('formulario');
const contenedor = document.getElementById('horas');
const copiarEmojisBtn = document.getElementById('copiarEmojis');
const copiarTextoBtn = document.getElementById('copiarTexto');
const botonesCopiarDiv = document.getElementById('botonesCopiar');

let textoParaCopiarEmojis = '';
let textoParaCopiarSoloTexto = '';

formulario.addEventListener('submit', function (e) {
  e.preventDefault();
  contenedor.innerHTML = '';
  textoParaCopiarEmojis = '';
  textoParaCopiarSoloTexto = '';
  botonesCopiarDiv.style.display = 'none';

  const input = document.getElementById('evento').value;
  if (!input) return;

  const localDate = new Date(input);
  const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);

  zonas.forEach(({ tz, flags, label, paises }) => {
    const opciones = {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: tz,
      hour12: false
    };
    const horaLocal = new Intl.DateTimeFormat('es-ES', opciones).format(utcDate);

    let banderaHTML = '';
    let banderaTextoEmojis = '';
    let textoPaises = paises.length ? paises.join(', ') : '';

    if (flags.length) {
      // Mostrar todas las banderas en pantalla y al copiar
      banderaHTML = flags.map(c => banderaImg(c)).join('');
      banderaTextoEmojis = flags.map(c => emojisBanderas[c] || '').join('');
    } else if (label) {
      banderaHTML = `<span>${label}</span>`;
      banderaTextoEmojis = label;
    }

    const linea = document.createElement('div');
    linea.className = 'hora';

    linea.innerHTML = `
      <div>
        <span>${horaLocal}</span>
        <span class="banderas">${banderaHTML}</span>
      </div>
      <div class="paises">${textoPaises}</div>
    `;

    contenedor.appendChild(linea);

    // Copiar SOLO hora + emojis (sin texto)
    textoParaCopiarEmojis += `${horaLocal} | ${banderaTextoEmojis}\n`;

    // Copiar SOLO hora + texto (sin emojis)
    textoParaCopiarSoloTexto += `${horaLocal} | ${textoPaises || (label || '—')}\n`;
  });

  botonesCopiarDiv.style.display = 'block';
  copiarEmojisBtn.textContent = 'Copiar con emojis';
  copiarTextoBtn.textContent = 'Copiar solo texto';
});

copiarEmojisBtn.addEventListener('click', () => {
  if (!textoParaCopiarEmojis) return;

  navigator.clipboard.writeText(textoParaCopiarEmojis).then(() => {
    copiarEmojisBtn.textContent = '¡Copiado! ✅';
    setTimeout(() => (copiarEmojisBtn.textContent = 'Copiar con emojis'), 2000);
  }).catch(() => {
    alert('No se pudo copiar al portapapeles.');
  });
});

copiarTextoBtn.addEventListener('click', () => {
  if (!textoParaCopiarSoloTexto) return;

  navigator.clipboard.writeText(textoParaCopiarSoloTexto).then(() => {
    copiarTextoBtn.textContent = '¡Copiado! ✅';
    setTimeout(() => (copiarTextoBtn.textContent = 'Copiar solo texto'), 2000);
  }).catch(() => {
    alert('No se pudo copiar al portapapeles.');
  });
});
