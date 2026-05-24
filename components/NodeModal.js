// components/NodeModal.js
const { ref, watch } = Vue;

export const NodeModal = {
    props: ['isOpen', 'node'],
    emits: ['close', 'save'],
    template: `
        <div v-if="isOpen && node" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" dir="rtl">
            <div class="bg-brand-panel border border-brand-gold/40 rounded-2xl w-full max-w-2xl shadow-[0_0_50px_rgba(250,204,21,0.15)] flex flex-col overflow-hidden max-h-[90vh]">
                
                <div class="px-6 py-4 border-b border-slate-700/80 bg-slate-800/30 flex items-center justify-between shrink-0">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="node.iconBg">
                            <i :class="['ph text-2xl', node.icon, node.color]"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-slate-100 text-base">تنظیمات {{ node.title }}</h3>
                            <p class="text-xs text-slate-400 mt-0.5">شخصی‌سازی و پیکربندی محتوای این گام</p>
                        </div>
                    </div>
                    <button @click="$emit('close')" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors">
                        <i class="ph ph-x text-xl"></i>
                    </button>
                </div>

                <div class="p-6 overflow-y-auto space-y-6 text-slate-200 text-sm custom-scrollbar">
                    
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-1.5">عنوان اصلی گام / مرحله:</label>
                        <input type="text" v-model="modalData.title" class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white outline-none focus:border-brand-gold transition-colors" />
                    </div>

                    <div v-if="node.type === 'stage'" class="space-y-2 border-b border-slate-700 pb-4">
                        <h4 class="text-sm font-bold text-emerald-400 flex items-center gap-2"><i class="ph ph-flag-checkered text-lg"></i> ماموریت کلی مرحله</h4>
                        <input type="text" v-model="modalData.stageMission" placeholder="مثال: حفظ و درک مفاهیم آیات ۱ تا ۵ سوره نبأ" class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white outline-none focus:border-brand-gold transition-colors" />
                    </div>

                    <div v-if="node.type === 'video' || node.type === 'stage'" class="space-y-4 bg-slate-800/20 p-4 rounded-xl border border-slate-800">
                        <h4 class="text-sm font-bold text-purple-400 flex items-center gap-2"><i class="ph ph-video-camera text-lg"></i> محتوای ویدیویی</h4>
                        <div>
                            <label class="block text-xs font-bold text-slate-400 mb-1.5">آپلود فایل ویدیو از سیستم:</label>
                            <div class="flex items-center gap-3">
                                <label class="flex-shrink-0 cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl px-4 py-2 text-xs font-bold transition-colors text-slate-300">
                                    <i class="ph ph-upload-simple mr-1"></i> انتخاب فایل
                                    <input type="file" accept="video/*" class="hidden" @change="handleVideoUpload" />
                                </label>
                                <div class="flex-1 text-xs text-slate-400 truncate">
                                    {{ modalData.localVideoName || 'هیچ ویدیویی انتخاب نشده است' }}
                                    <button v-if="modalData.localVideoName" @click="modalData.localVideoName = ''" class="text-red-400 hover:text-red-300 mr-2 text-[10px]"><i class="ph ph-x"></i> حذف</button>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="h-px bg-slate-700 flex-1"></div>
                            <span class="text-[10px] text-slate-500">یا استفاده از لینک</span>
                            <div class="h-px bg-slate-700 flex-1"></div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-400 mb-1.5">آدرس اینترنتی ویدیو (آپارات، یوتیوب و...):</label>
                            <input type="text" v-model="modalData.videoUrl" placeholder="https://example.com/video.mp4" class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white outline-none focus:border-brand-gold transition-colors" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-400 mb-1.5">توضیحات تکمیلی و درسنامه ویدیو:</label>
                            <textarea v-model="modalData.videoDesc" rows="3" placeholder="توضیحاتی که تمایل دارید کاربر پس از دیدن ویدیو بخواند..." class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white outline-none focus:border-brand-gold transition-colors resize-none"></textarea>
                        </div>
                    </div>

                    <div v-if="node.type === 'practice' || node.type === 'stage'" class="space-y-4 bg-slate-800/20 p-4 rounded-xl border border-slate-800">
                        <h4 class="text-sm font-bold text-green-400 flex items-center gap-2"><i class="ph ph-pencil-simple text-lg"></i> محتوای متنی و تصویری</h4>
                        <div>
                            <label class="block text-xs font-bold text-slate-400 mb-1.5">متن درسنامه یا تمرین:</label>
                            <textarea v-model="modalData.practiceText" rows="4" placeholder="متن درس، شرح مأموریت یا تمرین‌های عملی را وارد کنید..." class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white outline-none focus:border-brand-gold transition-colors resize-none"></textarea>
                        </div>
                        
                        <div>
                            <label class="block text-xs font-bold text-slate-400 mb-1.5">افزودن تصاویر پیوست:</label>
                            <label class="inline-flex align-center cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl px-4 py-2 text-xs font-bold transition-colors text-slate-300">
                                <i class="ph ph-image mr-1"> انتخاب تصویر</i>
                                <input type="file" accept="image/*" multiple class="hidden" @change="handleImageUpload" />
                            </label>
                            <div v-if="modalData.images && modalData.images.length > 0" class="mt-3 flex flex-wrap gap-2">
                                <div v-for="(img, idx) in modalData.images" :key="idx" class="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-xs">
                                    <i class="ph ph-image text-brand-gold"></i>
                                    <span class="max-w-[120px] truncate">{{ img }}</span>
                                    <button @click="removeImage(idx)" class="text-red-400 hover:text-red-300 ml-1"><i class="ph ph-trash"></i></button>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4 pt-2">
                            <div>
                                <label class="block text-xs font-bold text-slate-400 mb-1.5">زمان تقریبی مطالعه (دقیقه):</label>
                                <input type="number" v-model="modalData.readTime" min="1" class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white outline-none focus:border-brand-gold transition-colors" />
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-400 mb-1.5">درجه اهمیت:</label>
                                <select v-model="modalData.importance" class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white outline-none focus:border-brand-gold transition-colors">
                                    <option value="low">عادی (اختیاری)</option>
                                    <option value="medium">مهم (توصیه شده)</option>
                                    <option value="high">حیاتی (اجباری)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div v-if="node.type === 'quiz' || node.type === 'stage'" class="space-y-4 bg-slate-800/20 p-4 rounded-xl border border-slate-800">
                        <h4 class="text-sm font-bold text-blue-400 flex items-center gap-2"><i class="ph ph-exam text-lg"></i> طراحی سوالات و ارزیابی</h4>
                        <div>
                            <label class="block text-xs font-bold text-slate-400 mb-1.5">نوع سوالات در این بخش:</label>
                            <div class="grid grid-cols-3 gap-2">
                                <button type="button" @click="modalData.quizType = 'multiple'" :class="modalData.quizType === 'multiple' ? 'bg-brand-gold/15 border-brand-gold text-brand-gold' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'" class="py-2.5 border rounded-xl font-bold transition-all text-xs">تستی (۴ گزینه‌ای)</button>
                                <button type="button" @click="modalData.quizType = 'gap'" :class="modalData.quizType === 'gap' ? 'bg-brand-gold/15 border-brand-gold text-brand-gold' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'" class="py-2.5 border rounded-xl font-bold transition-all text-xs">جای خالی (متنی)</button>
                                <button type="button" @click="modalData.quizType = 'descriptive'" :class="modalData.quizType === 'descriptive' ? 'bg-brand-gold/15 border-brand-gold text-brand-gold' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'" class="py-2.5 border rounded-xl font-bold transition-all text-xs">تشریحی (صوتی/فایل)</button>
                            </div>
                        </div>

                        <div class="border-t border-slate-700/60 pt-4">
                            <div class="flex items-center justify-between mb-3">
                                <label class="block text-xs font-bold text-slate-400">بانک سوالات این بخش:</label>
                                <button type="button" @click="addQuizQuestion" class="flex items-center gap-1 text-xs text-brand-gold hover:text-brand-goldHover font-bold bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-700 hover:border-brand-gold transition-all">
                                    <i class="ph ph-plus"></i> سوال جدید
                                </button>
                            </div>

                            <div v-if="modalData.quizQuestions && modalData.quizQuestions.filter(q => q.type === modalData.quizType).length === 0" class="text-center py-6 bg-slate-900/40 rounded-xl border border-slate-800 text-xs text-slate-500">
                                هنوز هیچ سوالی برای این بخش طراحی نشده است.
                            </div>

                            <div v-else class="space-y-4 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                <div v-for="(q, qIdx) in modalData.quizQuestions.filter(q => q.type === modalData.quizType)" :key="q.id" class="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3 relative group">
                                    <button type="button" @click="removeQuizQuestion(q.id)" class="absolute top-3 left-3 text-slate-500 hover:text-red-400 transition-colors tooltip" title="حذف سوال">
                                        <i class="ph ph-trash text-base"></i>
                                    </button>
                                    
                                    <template v-if="modalData.quizType === 'multiple'">
                                        <div class="flex items-start gap-2 pl-6">
                                            <span class="text-xs font-bold text-brand-gold mt-1">سوال {{ qIdx + 1 }}:</span>
                                            <textarea v-model="q.text" rows="2" placeholder="متن صورت سوال را بنویسید..." class="flex-1 bg-transparent border border-slate-700 rounded-lg p-2 focus:border-brand-gold outline-none text-xs text-slate-200 resize-none"></textarea>
                                        </div>
                                        <p class="text-[10px] text-slate-400 px-2">پاسخ صحیح را با تیک زدن کنار گزینه مشخص کنید:</p>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                                            <div v-for="optIdx in [0, 1, 2, 3]" :key="optIdx" class="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1">
                                                <input type="radio" :name="'correct-'+q.id" :value="optIdx" v-model="q.correctIndex" class="w-3.5 h-3.5 accent-brand-gold cursor-pointer" />
                                                <input type="text" v-model="q.options[optIdx]" :placeholder="'گزینه ' + (optIdx+1)" class="bg-transparent flex-1 text-[11px] py-1 text-slate-300 outline-none focus:text-white" />
                                            </div>
                                        </div>
                                    </template>

                                    <template v-if="modalData.quizType === 'gap'">
                                        <div class="flex items-start gap-2 pl-6">
                                            <span class="text-xs font-bold text-brand-gold mt-1">متن {{ qIdx + 1 }}:</span>
                                            <textarea v-model="q.text" rows="2" placeholder="جمله را بنویسید و برای کلمه مخفی از [...] استفاده کنید. مثال: پایتخت ایران شهر [...] است." class="flex-1 bg-transparent border border-slate-700 rounded-lg p-2 focus:border-brand-gold outline-none text-xs text-slate-200 resize-none"></textarea>
                                        </div>
                                        <div class="flex items-center gap-2 pt-1">
                                            <i class="ph ph-check-circle text-green-400 text-lg"></i>
                                            <input type="text" v-model="q.gapAnswer" placeholder="پاسخ صحیح جای خالی (کلمه‌ای که کاربر باید تایپ کند)" class="bg-slate-950 border border-slate-800 text-[11px] rounded-lg px-3 py-2 flex-1 text-green-400 font-bold outline-none focus:border-green-500 transition-colors" />
                                        </div>
                                    </template>

                                    <template v-if="modalData.quizType === 'descriptive'">
                                        <div class="flex items-start gap-2 pl-6">
                                            <span class="text-xs font-bold text-brand-gold mt-1">سوال {{ qIdx + 1 }}:</span>
                                            <textarea v-model="q.text" rows="2" placeholder="متن سوال تشریحی یا درخواست پروژه را بنویسید..." class="flex-1 bg-transparent border border-slate-700 rounded-lg p-2 focus:border-brand-gold outline-none text-xs text-slate-200 resize-none"></textarea>
                                        </div>
                                        <div class="pt-2 flex flex-col gap-2">
                                            <span class="text-[10px] text-slate-400">کاربر مجاز است پاسخ خود را در چه قالب‌هایی ارسال کند؟</span>
                                            <div class="flex items-center gap-4 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
                                                <label class="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                                                    <input type="checkbox" v-model="q.allowText" class="accent-brand-gold rounded" /> متن تایپ شده
                                                </label>
                                                <label class="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                                                    <input type="checkbox" v-model="q.allowVoice" class="accent-brand-gold rounded" /> پیام صوتی
                                                </label>
                                                <label class="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                                                    <input type="checkbox" v-model="q.allowFile" class="accent-brand-gold rounded" /> آپلود فایل / تصویر
                                                </label>
                                            </div>
                                        </div>
                                    </template>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="node.type === 'start'" class="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl text-xs text-brand-gold leading-relaxed">
                        این گام به عنوان شروع‌کننده فصل جاری در نظر گرفته شده است. شما می‌توانید عنوان این گام را برای نمایش سفارشی کنید.
                    </div>

                    <div v-if="node.type !== 'start'" class="mt-6 pt-5 border-t border-slate-700/60 space-y-4">
                        <h4 class="text-sm font-bold text-brand-gold flex items-center gap-2"><i class="ph ph-star text-lg"></i> تنظیمات گیمیفیکیشن و پاداش (عمومی)</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-400 mb-1.5">پاداش عبور از مرحله (XP امتیاز):</label>
                                <input type="number" v-model="modalData.rewardXp" min="0" class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white outline-none focus:border-brand-gold transition-colors" />
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-400 mb-1.5">سکه اهدایی گیمیفیکیشن:</label>
                                <input type="number" v-model="modalData.rewardCoins" min="0" class="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white outline-none focus:border-brand-gold transition-colors" />
                            </div>
                        </div>
                        <div class="flex items-center gap-3 p-3.5 bg-slate-900/50 border border-slate-800 rounded-xl">
                            <input type="checkbox" :id="'requireApproval-' + node.id" v-model="modalData.requireApproval" class="w-4 h-4 rounded text-brand-gold accent-brand-gold cursor-pointer" />
                            <label :for="'requireApproval-' + node.id" class="text-xs text-slate-300 font-medium cursor-pointer select-none">
                                نیاز به بررسی و تایید دستی پاسخ‌ها توسط استاد ارزیاب دارد
                            </label>
                        </div>
                    </div>

                </div>

                <div class="px-6 py-4 border-t border-slate-700/80 bg-slate-800/30 flex items-center justify-end gap-3 shrink-0">
                    <button type="button" @click="$emit('close')" class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors">انصراف</button>
                    <button type="button" @click="save" class="px-5 py-2.5 bg-brand-gold hover:bg-brand-goldHover text-brand-dark rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(250,204,21,0.15)]">ذخیره تغییرات</button>
                </div>
            </div>
        </div>
    `,
    setup(props, { emit }) {
        const modalData = ref({});

        // دریافت اطلاعات به محض باز شدن مدال و کپی عمیق آن‌ها
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

        // متدهای آپلود و مدیریت تصاویر/ویدیو
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

        // متدهای مدیریت سوالات آزمون
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

        // ذخیره و ارسال اطلاعات به کامپوننت پدر
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