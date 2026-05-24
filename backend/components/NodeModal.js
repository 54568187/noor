// components/NodeModal.js
const { ref, watch } = Vue;

export const NodeModal = {
    props: ['isOpen', 'node'],
    emits: ['close', 'save'],
    template: `
        <transition name="modal-scale">
            <div v-if="isOpen && node" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md" dir="rtl" @click.self="$emit('close')">
                <div class="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl w-full max-w-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden max-h-[95vh] sm:max-h-[90vh] transform transition-all duration-500">
                    
                    <div class="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between shrink-0">
                        <div class="flex items-center gap-2 sm:gap-3">
                            <div class="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 duration-300 shrink-0" :class="node.iconBg">
                                <i :class="['ph-bold text-lg sm:text-xl', node.icon, node.color]"></i>
                            </div>
                            <div>
                                <h3 class="font-black text-slate-100 text-sm sm:text-base">تنظیمات {{ node.title }}</h3>
                                <p class="text-[10px] sm:text-xs text-slate-400 mt-0.5">شخصی‌سازی و پیکربندی محتوای این گام</p>
                            </div>
                        </div>
                        <button @click="$emit('close')" class="p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200 shrink-0">
                            <i class="ph ph-x text-base sm:text-lg"></i>
                        </button>
                    </div>

                    <div class="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 text-slate-200 text-sm custom-scrollbar">
                        
                        <div class="space-y-2">
                            <label class="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">عنوان اصلی گام / مرحله</label>
                            <div class="relative">
                                <span class="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-500"><i class="ph ph-text-aa text-base sm:text-lg"></i></span>
                                <input type="text" v-model="modalData.title" class="w-full bg-slate-950/60 border border-slate-800 focus:border-brand-gold/60 rounded-xl pr-9 sm:pr-11 pl-4 py-2.5 sm:py-3 text-sm text-white outline-none transition-all duration-200 placeholder-slate-600 focus:shadow-[0_0_15px_rgba(250,204,21,0.05)]" placeholder="عنوان مرحله را وارد کنید..." />
                            </div>
                        </div>

                        <div v-if="node.type === 'stage'" class="space-y-3 bg-emerald-500/5 border border-emerald-500/10 p-4 sm:p-5 rounded-2xl">
                            <h4 class="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-2">
                                <i class="ph ph-flag-checkered text-base sm:text-lg"></i> 
                                ماموریت کلی مرحله
                            </h4>
                            <p class="text-[10px] sm:text-xs text-slate-400 leading-relaxed">هدف اصلی که کاربر باید در این مرحله ترکیبی به آن برسد را مشخص کنید.</p>
                            <input type="text" v-model="modalData.stageMission" placeholder="مثال: حفظ و درک مفاهیم آیات ۱ تا ۵ سوره نبأ" class="w-full bg-slate-950/80 border border-emerald-500/20 focus:border-emerald-500/50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white outline-none transition-all" />
                        </div>

                        <div v-if="node.type === 'video' || node.type === 'stage'" class="space-y-4 bg-slate-950/40 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
                            <h4 class="text-xs sm:text-sm font-bold text-purple-400 flex items-center gap-2">
                                <i class="ph ph-video-camera text-base sm:text-lg"></i> 
                                محتوای ویدیویی
                            </h4>
                            
                            <div class="space-y-2">
                                <label class="block text-[10px] sm:text-xs font-bold text-slate-400">آپلود فایل ویدیو از سیستم</label>
                                <div class="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/60">
                                    <label class="flex-shrink-0 text-center cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-4 py-2.5 sm:py-2 text-xs font-bold transition-all text-slate-200 hover:text-white">
                                        <i class="ph ph-upload-simple ml-1"></i> انتخاب فایل ویدیو
                                        <input type="file" accept="video/*" class="hidden" @change="handleVideoUpload" />
                                    </label>
                                    <div class="flex-1 text-[11px] sm:text-xs text-slate-400 truncate px-1 sm:px-0 flex justify-between items-center">
                                        <span v-if="modalData.localVideoName" class="flex items-center gap-1.5 text-slate-300 font-medium truncate max-w-[80%]">
                                            <i class="ph ph-file-video text-purple-400 text-sm shrink-0"></i>
                                            <span class="truncate">{{ modalData.localVideoName }}</span>
                                        </span>
                                        <span v-else class="text-slate-500">فایلی انتخاب نشده</span>
                                        
                                        <button v-if="modalData.localVideoName" @click="modalData.localVideoName = ''" class="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-all shrink-0" title="حذف فایل">
                                            <i class="ph ph-trash text-sm"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-center gap-4 py-1">
                                <div class="h-px bg-slate-800 flex-1"></div>
                                <span class="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest font-bold">یا قرار دادن آدرس وب</span>
                                <div class="h-px bg-slate-800 flex-1"></div>
                            </div>

                            <div class="space-y-2">
                                <label class="block text-[10px] sm:text-xs font-bold text-slate-400">آدرس اینترنتی ویدیو</label>
                                <input type="text" v-model="modalData.videoUrl" placeholder="https://example.com/video.mp4" class="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500/50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white outline-none transition-all duration-200 placeholder-slate-700" />
                            </div>

                            <div class="space-y-2">
                                <label class="block text-[10px] sm:text-xs font-bold text-slate-400">توضیحات تکمیلی ویدیو</label>
                                <textarea v-model="modalData.videoDesc" rows="3" placeholder="توضیحاتی که تمایل دارید کاربر مطالعه کند..." class="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500/50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white outline-none transition-all duration-200 resize-none placeholder-slate-700"></textarea>
                            </div>
                        </div>

                        <div v-if="node.type === 'practice' || node.type === 'stage'" class="space-y-4 bg-slate-950/40 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
                            <h4 class="text-xs sm:text-sm font-bold text-green-400 flex items-center gap-2">
                                <i class="ph ph-pencil-simple text-base sm:text-lg"></i> 
                                محتوای متنی و تمرینات
                            </h4>
                            
                            <div class="space-y-2">
                                <label class="block text-[10px] sm:text-xs font-bold text-slate-400">متن درسنامه یا تمرین‌های عملی</label>
                                <textarea v-model="modalData.practiceText" rows="4" placeholder="جزئیات دقیق را بنویسید..." class="w-full bg-slate-950/60 border border-slate-800 focus:border-green-500/50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white outline-none transition-all duration-200 resize-none placeholder-slate-700"></textarea>
                            </div>
                            
                            <div class="space-y-2">
                                <label class="block text-[10px] sm:text-xs font-bold text-slate-400">تصاویر پیوست شده</label>
                                <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <label class="cursor-pointer text-center bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold transition-all text-slate-200 hover:text-white flex items-center justify-center gap-1.5">
                                        <i class="ph ph-image text-sm text-green-400"></i> انتخاب تصویر جدید
                                        <input type="file" accept="image/*" multiple class="hidden" @change="handleImageUpload" />
                                    </label>
                                </div>
                                <div v-if="modalData.images && modalData.images.length > 0" class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div v-for="(img, idx) in modalData.images" :key="idx" class="flex items-center justify-between bg-slate-950 border border-slate-850 px-3 py-2 rounded-xl text-xs transition-colors hover:border-slate-800">
                                        <span class="flex items-center gap-2 text-slate-300 truncate max-w-[80%]">
                                            <i class="ph ph-image text-brand-gold text-sm shrink-0"></i>
                                            <span class="truncate">{{ img }}</span>
                                        </span>
                                        <button @click="removeImage(idx)" class="text-red-400 hover:text-white p-1 rounded-lg hover:bg-red-500/10 transition-all shrink-0">
                                            <i class="ph ph-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div class="space-y-2">
                                    <label class="block text-[10px] sm:text-xs font-bold text-slate-400">زمان تقریبی مطالعه (دقیقه)</label>
                                    <input type="number" v-model="modalData.readTime" min="1" class="w-full bg-slate-950/60 border border-slate-800 focus:border-green-500/50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white outline-none transition-all" />
                                </div>
                                <div class="space-y-2">
                                    <label class="block text-[10px] sm:text-xs font-bold text-slate-400">درجه اهمیت گام</label>
                                    <select v-model="modalData.importance" class="w-full bg-slate-950/60 border border-slate-800 focus:border-green-500/50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white outline-none transition-all">
                                        <option value="low">🟢 عادی (اختیاری)</option>
                                        <option value="medium">🟡 مهم (توصیه شده)</option>
                                        <option value="high">🔴 حیاتی (اجباری)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div v-if="node.type === 'quiz' || node.type === 'stage'" class="space-y-4 bg-slate-950/40 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
                            <h4 class="text-xs sm:text-sm font-bold text-blue-400 flex items-center gap-2">
                                <i class="ph ph-exam text-base sm:text-lg"></i> 
                                طراحی سوالات و ارزیابی
                            </h4>
                            
                            <div class="space-y-2">
                                <label class="block text-[10px] sm:text-xs font-bold text-slate-400">نوع سوال آزمون</label>
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-850">
                                    <button type="button" @click="modalData.quizType = 'multiple'" :class="modalData.quizType === 'multiple' ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'" class="py-2.5 border rounded-xl font-bold transition-all text-xs">تستی (۴ گزینه‌ای)</button>
                                    <button type="button" @click="modalData.quizType = 'gap'" :class="modalData.quizType === 'gap' ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'" class="py-2.5 border rounded-xl font-bold transition-all text-xs">جای خالی (متنی)</button>
                                    <button type="button" @click="modalData.quizType = 'descriptive'" :class="modalData.quizType === 'descriptive' ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'" class="py-2.5 border rounded-xl font-bold transition-all text-xs">تشریحی (آزاد)</button>
                                </div>
                            </div>

                            <div class="border-t border-slate-800/60 pt-4 space-y-3">
                                <div class="flex items-center justify-between">
                                    <label class="block text-[10px] sm:text-xs font-bold text-slate-400">لیست سوالات طراحی شده</label>
                                    <button type="button" @click="addQuizQuestion" class="flex items-center gap-1.5 text-[10px] sm:text-xs text-brand-gold hover:text-brand-goldHover font-bold bg-slate-950 hover:bg-slate-900 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-800 hover:border-brand-gold/60 transition-all">
                                        <i class="ph ph-plus"></i> سوال جدید
                                    </button>
                                </div>

                                <div v-if="modalData.quizQuestions && modalData.quizQuestions.filter(q => q.type === modalData.quizType).length === 0" class="text-center py-6 sm:py-8 bg-slate-950 rounded-2xl border border-slate-850/60 text-xs text-slate-500">
                                    <i class="ph ph-info text-lg block mb-1.5 opacity-60"></i>
                                    هنوز سوالی طراحی نشده است.
                                </div>

                                <div v-else class="space-y-4 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                    <div v-for="(q, qIdx) in modalData.quizQuestions.filter(q => q.type === modalData.quizType)" :key="q.id" class="p-3 sm:p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3 relative group">
                                        <button type="button" @click="removeQuizQuestion(q.id)" class="absolute top-2 left-2 sm:top-4 sm:left-4 text-slate-500 hover:text-red-400 hover:bg-red-500/5 p-1 rounded-lg transition-all" title="حذف سوال">
                                            <i class="ph ph-trash text-base"></i>
                                        </button>
                                        
                                        <template v-if="modalData.quizType === 'multiple'">
                                            <div class="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 sm:pl-8">
                                                <span class="text-[10px] sm:text-xs font-extrabold text-blue-400 sm:mt-2 shrink-0">سوال {{ qIdx + 1 }}:</span>
                                                <textarea v-model="q.text" rows="2" placeholder="متن صورت سوال..." class="w-full sm:flex-1 bg-transparent border border-slate-800/80 rounded-xl p-2.5 focus:border-blue-500/40 outline-none text-xs text-slate-200 resize-none transition-all"></textarea>
                                            </div>
                                            <p class="text-[9px] sm:text-[10px] text-slate-500">گزینه صحیح را مشخص کنید:</p>
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                                <div v-for="optIdx in [0, 1, 2, 3]" :key="optIdx" class="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 transition-all focus-within:border-blue-500/30">
                                                    <input type="radio" :name="'correct-'+q.id" :value="optIdx" v-model="q.correctIndex" class="w-4 h-4 accent-brand-gold cursor-pointer" />
                                                    <input type="text" v-model="q.options[optIdx]" :placeholder="'گزینه ' + (optIdx+1)" class="bg-transparent flex-1 text-[11px] py-1 text-slate-300 outline-none focus:text-white" />
                                                </div>
                                            </div>
                                        </template>

                                        <template v-if="modalData.quizType === 'gap'">
                                            <div class="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 sm:pl-8">
                                                <span class="text-[10px] sm:text-xs font-bold text-blue-400 sm:mt-2 shrink-0">متن {{ qIdx + 1 }}:</span>
                                                <textarea v-model="q.text" rows="2" placeholder="جمله را بنویسید..." class="w-full sm:flex-1 bg-transparent border border-slate-800/80 rounded-xl p-2.5 focus:border-blue-500/40 outline-none text-xs text-slate-200 resize-none transition-all"></textarea>
                                            </div>
                                            <div class="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                                                <span class="text-[10px] sm:text-xs text-slate-500 font-bold shrink-0">پاسخ صحیح:</span>
                                                <input type="text" v-model="q.gapAnswer" placeholder="کلمه‌ای که جای خالی را پر می‌کند" class="w-full bg-slate-900 border border-slate-800 text-xs rounded-xl px-3 py-2 text-emerald-400 font-bold outline-none focus:border-emerald-500/30 transition-colors" />
                                            </div>
                                        </template>

                                        <template v-if="modalData.quizType === 'descriptive'">
                                            <div class="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 sm:pl-8">
                                                <span class="text-[10px] sm:text-xs font-bold text-blue-400 sm:mt-2 shrink-0">سوال {{ qIdx + 1 }}:</span>
                                                <textarea v-model="q.text" rows="2" placeholder="متن سوال تشریحی..." class="w-full sm:flex-1 bg-transparent border border-slate-800/80 rounded-xl p-2.5 focus:border-blue-500/40 outline-none text-xs text-slate-200 resize-none transition-all"></textarea>
                                            </div>
                                            <div class="space-y-2 mt-2">
                                                <span class="text-[9px] sm:text-[10px] text-slate-500 font-bold">فرمت‌های مجاز:</span>
                                                <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
                                                    <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                                                        <input type="checkbox" v-model="q.allowText" class="w-4 h-4 accent-brand-gold rounded" /> متن تایپ شده
                                                    </label>
                                                    <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                                                        <input type="checkbox" v-model="q.allowVoice" class="w-4 h-4 accent-brand-gold rounded" /> پیام صوتی
                                                    </label>
                                                    <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                                                        <input type="checkbox" v-model="q.allowFile" class="w-4 h-4 accent-brand-gold rounded" /> آپلود فایل
                                                    </label>
                                                </div>
                                            </div>
                                        </template>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="node.type === 'start'" class="p-3 sm:p-4 bg-brand-gold/5 border border-brand-gold/20 rounded-2xl text-[11px] sm:text-xs text-brand-gold leading-relaxed flex gap-2 sm:gap-3 items-start">
                            <i class="ph ph-info text-base sm:text-lg mt-0.5 shrink-0"></i>
                            <span>این گام آغازکننده فصل کنونی است. تنظیمات پیشرفته محتوا برای گام شروع وجود ندارد اما می‌توانید نام آن را متناسب با سلیقه خود تغییر دهید.</span>
                        </div>

                        <div v-if="node.type !== 'start'" class="mt-5 sm:mt-6 pt-5 border-t border-slate-800/80 space-y-4">
                            <h4 class="text-xs sm:text-sm font-bold text-brand-gold flex items-center gap-2">
                                <i class="ph ph-star text-base sm:text-lg"></i> 
                                پاداش‌ها و گیمیفیکیشن
                            </h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div class="space-y-2">
                                    <label class="block text-[10px] sm:text-xs font-bold text-slate-400">میزان تجربه هدیه (XP)</label>
                                    <div class="relative">
                                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs text-slate-500 font-bold">XP</span>
                                        <input type="number" v-model="modalData.rewardXp" min="0" class="w-full bg-slate-950/60 border border-slate-800 focus:border-brand-gold/40 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white outline-none transition-all" />
                                    </div>
                                </div>
                                <div class="space-y-2">
                                    <label class="block text-[10px] sm:text-xs font-bold text-slate-400">سکه اهدایی</label>
                                    <div class="relative">
                                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-brand-gold"><i class="ph-fill ph-coins"></i></span>
                                        <input type="number" v-model="modalData.rewardCoins" min="0" class="w-full bg-slate-950/60 border border-slate-800 focus:border-brand-gold/40 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white outline-none transition-all" />
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-start sm:items-center gap-3 p-3 sm:p-4 bg-slate-950/50 border border-slate-850 rounded-2xl transition-all hover:bg-slate-950/80">
                                <input type="checkbox" :id="'requireApproval-' + node.id" v-model="modalData.requireApproval" class="w-4 h-4 mt-0.5 sm:mt-0 rounded text-brand-gold accent-brand-gold cursor-pointer shrink-0" />
                                <label :for="'requireApproval-' + node.id" class="text-[11px] sm:text-xs text-slate-300 font-bold cursor-pointer select-none leading-relaxed">
                                    نیاز به بررسی و تایید دستی پاسخ‌ها توسط استاد ارزیاب دارد
                                </label>
                            </div>
                        </div>

                    </div>

                    <div class="px-4 sm:px-6 py-4 sm:py-5 border-t border-slate-800/80 bg-slate-900/50 flex flex-row items-center justify-end gap-2 sm:gap-3 shrink-0">
                        <button type="button" @click="$emit('close')" class="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 sm:py-3 bg-slate-800 hover:bg-slate-700/80 text-slate-300 rounded-xl text-xs font-bold transition-all duration-200">انصراف</button>
                        <button type="button" @click="save" class="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-brand-gold hover:bg-brand-goldHover text-brand-dark rounded-xl text-xs font-black transition-all duration-200 shadow-[0_4px_20px_rgba(250,204,21,0.2)]">ذخیره تغییرات</button>
                    </div>
                </div>
            </div>
        </transition>
    `,
    setup(props, { emit }) {
        const modalData = ref({});

        watch(() => props.node, (newNode) => {
            if (newNode) {
                modalData.value = {
                    title: newNode.title || '',
                    videoUrl: newNode.videoUrl || '',
                    localVideoName: newNode.localVideoName || '',
                    videoDesc: newNode.videoDesc || '',
                    practiceText: newNode.practiceText || '',
                    images: newNode.images ? [...newNode.images] : [],
                    readTime: newNode.readTime || 5,
                    importance: newNode.importance || 'low',
                    quizType: newNode.quizType || 'multiple',
                    quizQuestions: JSON.parse(JSON.stringify(newNode.quizQuestions || [])),
                    stageMission: newNode.stageMission || '',
                    rewardXp: newNode.rewardXp !== undefined ? newNode.rewardXp : 50,
                    rewardCoins: newNode.rewardCoins !== undefined ? newNode.rewardCoins : 10,
                    requireApproval: !!newNode.requireApproval
                };
            }
        }, { deep: true, immediate: true });

        const handleVideoUpload = (e) => {
            const file = e.target.files[0];
            if (file) {
                modalData.value.localVideoName = file.name;
                modalData.value.videoUrl = '';
            }
        };

        const handleImageUpload = (e) => {
            const files = Array.from(e.target.files);
            if (!modalData.value.images) modalData.value.images = [];
            files.forEach(f => {
                modalData.value.images.push(f.name);
            });
        };

        const removeImage = (index) => {
            modalData.value.images.splice(index, 1);
        };

        const addQuizQuestion = () => {
            if (!modalData.value.quizQuestions) modalData.value.quizQuestions = [];
            modalData.value.quizQuestions.push({
                id: Date.now() + Math.random().toString(36).substr(2, 9),
                type: modalData.value.quizType,
                text: '',
                options: ['', '', '', ''],
                correctIndex: 0,
                gapAnswer: '',
                allowText: true,
                allowVoice: false,
                allowFile: false
            });
        };

        const removeQuizQuestion = (qId) => {
            const index = modalData.value.quizQuestions.findIndex(q => q.id === qId);
            if (index !== -1) {
                modalData.value.quizQuestions.splice(index, 1);
            }
        };

        const save = () => {
            emit('save', modalData.value);
        };

        return { 
            modalData, 
            handleVideoUpload, 
            handleImageUpload, 
            removeImage, 
            addQuizQuestion, 
            removeQuizQuestion, 
            save 
        };
    }
};