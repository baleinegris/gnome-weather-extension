import St from 'gi://St';
import Clutter from 'gi://Clutter';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import { LibSoup } from './libsoup.js';



export default class ExampleExtension extends Extension {
    constructor(metadata) {
        super(metadata);
        this._indicator = null;        
    }

    async enable() {
        const params = {
            "latitude": "43.9779",
            "longitude": "-79.9572",
            "hourly": "temperature_2m",
        };
        this._indicator = new PanelMenu.Button(0.0, this.metadata.name, false);

        let soup = new LibSoup();
        const responses = await soup.fetchJson('https://api.open-meteo.com/v1/forecast', params);

        console.log(responses);

        this._indicator.add_child(new St.Label({ 
            text: `Temperature: ${responses.body.hourly.temperature_2m[0]}°C`,
            y_align: Clutter.ActorAlign.CENTER 
        }));

        // Add the indicator to the panel
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._indicator?.destroy();
        this._indicator = null;
    }
}