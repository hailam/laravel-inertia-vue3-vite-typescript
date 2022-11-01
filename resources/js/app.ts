import './bootstrap';
import '../css/app.css';

import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/inertia-vue3';
import { InertiaProgress } from '@inertiajs/progress';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ZiggyVue } from '../../vendor/tightenco/ziggy/dist/vue.m';

// Toast notifications
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";


const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

async function _resolvePageComponent(name: string, pages: Record<string, any>) {
    const page = pages[name];
    //console.log(Object.keys(pages))
    //console.log('page', page);
    if (typeof page === 'undefined') {
        throw new Error(`Page not found: ${name}`);
    }
    return typeof page === 'function' ? page() : page;
    /*
	const path = Object.keys(pages)
		.sort((a, b) => a.length - b.length)
		.find((path) => path.endsWith(`${name.replaceAll('.', '/')}.vue`));

	if (!path) {
		throw new Error(`Page not found: ${name}`)
	}

	return typeof pages[path] === 'function'
		? await pages[path]()
		: pages[path]
    */
}

// glob import all pages
//import.meta?.glob('./Pages/**/*.vue')
const pages = import.meta.glob('./Pages/**/*');
//console.log(import.meta.glob, 'glob', pages, Object.keys(import.meta));
if (typeof Ziggy == 'undefined') {
    throw new Error('Ziggy is not defined. Please check your config.');
} 

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => _resolvePageComponent(`./Pages/${name}.vue`, pages),
    async setup({ el, app, props, plugin }) {
        return createApp({ render: () => h(app, props) })
            .use(plugin)
            .use(ZiggyVue, Ziggy ?? null) // Ziggy is defined in the app.blade.php file
            .use(Toast, {
                position: 'bottom-right',
            })
            .mount(el);
    },
});

InertiaProgress.init({ color: '#4B5563' });
