import renderer, { tsx } from '@dojo/framework/core/vdom';
import global from '@dojo/framework/shim/global';
import Registry from '@dojo/framework/core/Registry';
import StateHistory from '@dojo/framework/routing/history/StateHistory';
import { registerRouterInjector } from '@dojo/framework/routing/RouterInjector';

import routes from './routes';
import App from './App';

const registry = new Registry();
registerRouterInjector(routes, registry, {
	HistoryManager: StateHistory,
	setDocumentTitle: ({ params, id }) => {
		if (id === 'blogs') {
			return `WordPress blog by Dojo - page ${params.page}`;
		}
		return `WordPress blog by Dojo - ${params.slug}`;
	}
});
const r = renderer(() => <App />);
r.mount({ registry, domNode: global.document.getElementById('app') });
