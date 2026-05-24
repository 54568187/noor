// components/ZoomControls.js

export const ZoomControls = {
    props: ['zoomLevel'],
    emits: ['zoom-in', 'zoom-out', 'reset-zoom'],
    template: `
        <div class="absolute bottom-6 left-6 flex items-center bg-brand-panel border border-slate-700 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] z-40 p-2 gap-2" dir="rtl">
            <button @click="$emit('zoom-in')" class="p-2 rounded-xl text-slate-400 hover:text-brand-gold hover:bg-slate-700/50" title="بزرگ‌نمایی">
                <i class="ph ph-magnifying-glass-plus text-xl"></i>
            </button>
            <div @click="$emit('reset-zoom')" class="text-[11px] text-brand-gold font-bold cursor-pointer hover:text-brand-goldHover text-center min-w-[36px] select-none" title="بازگشت به ۱۰۰٪">
                {{ Math.round(zoomLevel * 100) }}%
            </div>
            <button @click="$emit('zoom-out')" class="p-2 rounded-xl text-slate-400 hover:text-brand-gold hover:bg-slate-700/50" title="کوچک‌نمایی">
                <i class="ph ph-magnifying-glass-minus text-xl"></i>
            </button>
        </div>
    `
};