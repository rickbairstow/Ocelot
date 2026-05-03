import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, within } from 'storybook/test'
import Badge from '@Components/Badge.vue'
import Banner from '@Components/Banner.vue'
import Breadcrumb from '@Components/Breadcrumb.vue'
import Button from '@Components/Button.vue'
import Card from '@Components/Card.vue'
import NavigationBar from '@Components/NavigationBar.vue'
import Pagination from '@Components/Pagination.vue'
import Stepper from '@Components/Stepper.vue'

const meta: Meta = {
    title: 'Patterns/RTL Layouts',
    parameters: {
        docs: {
            description: {
                component: 'Right-to-left smoke-test compositions for common OUI primitives. These stories document current RTL behaviour and provide a visual regression target.'
            }
        }
    }
}

export default meta
type Story = StoryObj<typeof meta>

export const ApplicationShell: Story = {
    render: () => ({
        components: { Badge, Banner, Breadcrumb, Button, Card, NavigationBar, Pagination, Stepper },
        setup() {
            const breadcrumbItems = [
                { href: '#', label: 'الرئيسية' },
                { href: '#', label: 'المشاريع' },
                { label: 'إطلاق المنتج' }
            ]
            const steps = [
                { title: 'المراجعة', description: 'فحص المحتوى' },
                { title: 'الاعتماد', description: 'تأكيد الفريق' },
                { title: 'النشر', description: 'إطلاق النسخة' }
            ]

            return { breadcrumbItems, steps }
        },
        template: `
            <div dir="rtl" class="min-h-screen bg-gray-50 text-gray-950 dark:bg-gray-950 dark:text-gray-50">
                <NavigationBar show-menu-toggle>
                    <template #brand>
                        <p class="text-sm font-semibold">لوحة أوسيلوت</p>
                    </template>

                    <template #nav>
                        <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800" aria-current="page">نظرة عامة</a>
                        <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">التقارير</a>
                        <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">الإعدادات</a>
                    </template>

                    <template #mobile-menu>
                        <nav aria-label="تنقل الجوال" class="grid gap-1">
                            <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800" aria-current="page">نظرة عامة</a>
                            <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">التقارير</a>
                            <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">الإعدادات</a>
                        </nav>
                    </template>

                    <template #actions>
                        <Button color="blue" icon="Plus" variant="primary">إجراء جديد</Button>
                    </template>
                </NavigationBar>

                <main class="mx-auto grid max-w-5xl gap-6 px-4 py-6 sm:px-6">
                    <Breadcrumb :items="breadcrumbItems" />

                    <Banner title="تم حفظ التغييرات" type="success">
                        تمت مزامنة إعدادات مساحة العمل مع الفريق.
                    </Banner>

                    <Stepper aria-label="خطوات النشر" :model-value="2" :steps="steps" />

                    <Card class="w-full" title="قائمة المراجعة" variant="bordered" vertical>
                        <template #content>
                            <div class="grid gap-3 text-sm">
                                <div class="flex items-center justify-between gap-3">
                                    <span>اختبار الوصول</span>
                                    <Badge color="green" size="sm">مكتمل</Badge>
                                </div>
                                <div class="flex items-center justify-between gap-3">
                                    <span>مراجعة المحتوى</span>
                                    <Badge color="orange" size="sm">قيد العمل</Badge>
                                </div>
                            </div>
                        </template>
                        <template #actions>
                            <Button color="gray" variant="secondary">عرض التفاصيل</Button>
                        </template>
                    </Card>

                    <Pagination
                        :model-value="2"
                        :total="5"
                    />
                </main>
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await expect(canvasElement.querySelector('[dir="rtl"]')).not.toBeNull()
        await expect(canvas.getByText('تم حفظ التغييرات')).toBeVisible()
        await expect(canvas.getByRole('list', { name: /خطوات النشر/i })).toBeVisible()
    }
}
