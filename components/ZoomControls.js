// components/ZoomControls.js

export const ZoomControls = {
    props: ['zoomLevel'],
    emits: ['zoom-in', 'zoom-out', 'reset-zoom'],
    template: `
        <div class="absolute bottom-20 md:bottom-6 left-4 md:left-6 flex items-center bg-brand-panel border border-slate-700 rounded-xl md:rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] z-40 p-1.5 md:p-2 gap-1 md:gap-2 scale-90 md:scale-100 origin-bottom-left" dir="rtl">
            <button @click="$emit('zoom-in')" class="p-1.5 md:p-2 rounded-lg md:rounded-xl text-slate-400 hover:text-brand-gold hover:bg-slate-700/50 transition-colors" title="بزرگ‌نمایی">
                <i class="ph ph-magnifying-glass-plus text-lg md:text-xl"></i>
            </button>
            <div @click="$emit('reset-zoom')" class="text-[10px] md:text-[11px] text-brand-gold font-bold cursor-pointer hover:text-brand-goldHover text-center min-w-[32px] md:min-w-[36px] select-none" title="بازگشت به ۱۰۰٪">
                {{ Math.round(zoomLevel * 100) }}%
            </div>
            <button @click="$emit('zoom-out')" class="p-1.5 md:p-2 rounded-lg md:rounded-xl text-slate-400 hover:text-brand-gold hover:bg-slate-700/50 transition-colors" title="کوچک‌نمایی">
                <i class="ph ph-magnifying-glass-minus text-lg md:text-xl"></i>
            </button>
        </div>
    `
};