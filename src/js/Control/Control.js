/**
 * @namespace BKGWebMap.Control
 * @type {object}
 */
BKGWebMap.Control = BKGWebMap.Control || {};
/**
 * Create four standard positions for map controls (top-left, top-right, bottom-left, bottom-right)
 * @typedef {function} CONTROL_FACTORIES_standardPosition
 * @param {object} map - Map object
 * @param {string} position - Position of control (top-left, top-right, bottom-left, bottom-right)
 * @returns {object}
 */
/**
 * Create panel Control
 * @typedef {function} CONTROL_FACTORIES_panel
 * @param {object} map - Map object
 * @param {string} panelPosition - Panel position (Values: "left", "right") (/options/panelPosition)
 * @param {object} initialize - Tool that should be shown, when starting the Application. If empty or null, then panel will be closed. (Values: "geoSearch", "searchCoordinates", "layerSwitcher", "legend", "showAttributes", "copyCoordinates", "measure", "edit", "share") (/options/initialize)
 * @param {object} standardPositionControls - Object with standardPositionControls
 * @returns {object}
 */
/**
 * @typedef {object} layerSwitcher_options
 * @property {boolean} active - Activate tool. (/options/tools/layerSwitcher/active)
 * @property {string|null} div - DIV ID. (/options/tools/layerSwitcher/div)
 * @property {string} style - CSS Class used for styling. (/options/tools/layerSwitcher/style)
 * @property {boolean} editStyle - User can change style of vector layers. (/options/tools/layerSwitcher/editStyle)
 * @property {boolean} changeVisibility - User can change visibility of layers. (/options/tools/layerSwitcher/changeVisibility)
 * @property {boolean} changeOrder - User can change layer order. (/options/tools/layerSwitcher/changeOrder)
 * @property {boolean} showWMSLayers - Show layers of WMS Services in menu. (/options/tools/layerSwitcher/showWMSLayers)
 * @property {integer} openLevel - Define which level of layerswitcher should be open. 0: Menu is closed, 1: Basemaps/Overlays menu is open, 2: Group layers are open. (/options/tools/layerSwitcher/openLevel)
 */
/**
 * Create layerSwitcher Control
 * @typedef {function} CONTROL_FACTORIES_layerSwitcher
 * @param {object} map - Map object
 * @param {string} controlName - Name of control (layerSwitcher)
 * @param {object} options - Control options. See properties in {@link layerSwitcher_options}
 * @param {object} panel - Panel object
 * @returns {object}
 */
/**
 * @typedef {object} showAttributes_options
 * @property {boolean} active - Activate tool. (/options/tools/showAttributes/active)
 * @property {string|null} div - DIV ID. (/options/tools/showAttributes/div)
 * @property {string} style - CSS Class used for styling. (/options/tools/showAttributes/style)
 */
/**
 * Create showAttributes Control
 * @typedef {function} CONTROL_FACTORIES_showAttributes
 * @param {object} map - Map object
 * @param {string} controlName - Name of control (showAttributes)
 * @param {object} options - Control options. See properties in {@link showAttributes_options}
 * @param {object} panel - Panel object
 * @returns {object}
 */
/**
 * @typedef {object} legend_options
 * @property {boolean} active - Activate tool. (/options/tools/legend/active)
 * @property {string|null} div - DIV ID. (/options/tools/legend/div)
 * @property {string} style - CSS Class used for styling. (/options/tools/legend/style)
 */
/**
 * Create legend Control
 * @typedef {function} CONTROL_FACTORIES_legend
 * @param {object} map - Map object
 * @param {string} controlName - Name of control (legend)
 * @param {object} options - Control options. See properties in {@link legend_options}
 * @param {object} panel - Panel object
 * @returns {object}
 */
/**
 * @typedef {object} zoom_options
 * @property {boolean} active - Activate tool. (/options/tools/zoom/active)
 * @property {boolean} showZoomLevel - Show zoom level as text under the zoom buttons. (/options/tools/zoom/showZoomLevel)
 * @property {boolean} zoomToFullExtent - Zoom to full extent button. (/options/tools/zoom/zoomToFullExtent)
 * @property {boolean} history - Navigation history buttons. (/options/tools/zoom/history)
 * @property {string} position - Position of control. It will be used only if div is null. Values: 'top-left', 'top-right', 'bottom-left', 'bottom-right' or CSS properties (e.g. 'left: 5px; top: 10px;'). (/options/tools/zoom/position)
 * @property {string|null} div - DIV ID. (/options/tools/zoom/div)
 * @property {string} style - CSS Class used for styling. (/options/tools/zoom/style)
 * @property {boolean} onlyFullScreen - Tool available only in full screen mode. (/options/tools/zoom/onlyFullScreen)
 */
/**
 * Create zoom Control
 * @typedef {function} CONTROL_FACTORIES_zoom
 * @param {object} map - Map object
 * @param {string} controlName - Name of control (zoom)
 * @param {object} options - Control options. See properties in {@link zoom_options}
 * @param {object} panel - Panel object
 * @param {object} standardPositionControls - Object with standardPositionControls
 * @returns {object}
 */
/**
 * @typedef {object} fullScreen_options
 * @property {boolean} active - Activate tool. (/options/tools/fullScreen/active)
 * @property {string} position - Position of control. It will be used only if div is null. Values: 'top-left', 'top-right', 'bottom-left', 'bottom-right' or CSS properties (e.g. 'left: 5px; top: 10px;'). (/options/tools/fullScreen/position)
 * @property {string|null} div - DIV ID. (/options/tools/fullScreen/div)
 * @property {string} style - CSS Class used for styling. (/options/tools/fullScreen/style)
 */
/**
 * Create fullScreen Control
 * @typedef {function} CONTROL_FACTORIES_fullScreen
 * @param {object} map - Map object
 * @param {string} controlName - Name of control (fullScreen)
 * @param {object} options - Control options. See properties in {@link fullScreen_options}
 * @param {object} panel - Panel object
 * @param {object} standardPositionControls - Object with standardPositionControls
 * @returns {object}
 */
/**
 * @typedef {object} measure_options
 * @property {boolean} active - Activate tool. (/options/tools/measure/active)
 * @property {string|null} div - DIV ID. (/options/tools/measure/div)
 * @property {string} style - CSS Class used for styling. (/options/tools/measure/style)
 */
/**
 * Create measure Control
 * @typedef {function} CONTROL_FACTORIES_measure
 * @param {object} map - Map object
 * @param {string} controlName - Name of control (measure)
 * @param {object} options - Control options. See properties in {@link measure_options}
 * @param {object} panel - Panel object
 * @returns {object}
 */
/**
 * @typedef {object} edit_options
 * @property {boolean} active - Activate tool. (/options/tools/edit/active)
 * @property {string|null} div - DIV ID. (/options/tools/edit/div)
 * @property {string} style - CSS Class used for styling. (/options/tools/edit/style)
 * @property {boolean} emptyLayer - If edit is active and there is no vector layer, add an empty vector layer. (/options/tools/edit/emptyLayer)
 * @property {object} export - Export editable layers. (/options/tools/edit/export)
 * @property {boolean} export.active - Activate tool. (/options/tools/edit/export/active)
 * @property {array} export.formats - Export formats. (Array values: "KML", "GML", "GEOJSON", "GPX", "WKT") (/options/tools/edit/export/formats)
 */
/**
 * Create edit Control
 * @typedef {function} CONTROL_FACTORIES_edit
 * @param {object} map - Map object
 * @param {string} controlName - Name of control (edit)
 * @param {object} options - Control options. See properties in {@link edit_options}
 * @param {object} panel - Panel object
 * @returns {object}
 */
/**
 * @typedef {object} scalebar_options
 * @property {boolean} active - Activate tool. (/options/tools/scalebar/active)
 * @property {string} position - Position of control. It will be used only if div is null. Values: 'top-left', 'top-right', 'bottom-left', 'bottom-right' or CSS properties (e.g. 'left: 5px; top: 10px;'). (/options/tools/scalebar/position)
 * @property {string} scalebarType - Type of scalebar. (Values: "mapscale", "resolution", "distance", "mapscaleDistance", "resolutionDistance") (/options/tools/scalebar/scalebarType)
 * @property {string|null} div - DIV ID. (/options/tools/scalebar/div)
 * @property {string} style - CSS Class used for styling. (/options/tools/scalebar/style)
 * @property {boolean} onlyFullScreen - Tool available only in full screen mode. (/options/tools/scalebar/onlyFullScreen)
 */
/**
 * Create scalebar Control
 * @typedef {function} CONTROL_FACTORIES_scalebar
 * @param {object} map - Map object
 * @param {string} controlName - Name of control (scalebar)
 * @param {object} options - Control options. See properties in {@link scalebar_options}
 * @param {object} panel - Panel object
 * @param {object} standardPositionControls - Object with standardPositionControls
 * @returns {object}
 */
/**
 * @typedef {object} showCoordinates_options
 * @property {boolean} active - Activate tool. (/options/tools/showCoordinates/active)
 * @property {string} position - Position of control. It will be used only if div is null. Values: 'top-left', 'top-right', 'bottom-left', 'bottom-right' or CSS properties (e.g. 'left: 5px; top: 10px;'). (/options/tools/showCoordinates/position)
 * @property {object[]} coordinateSystems - Coordinate systems for dropdown menu. (/options/tools/showCoordinates/coordinateSystems) <br> <b>Below are properties of each Object in Array:</b>
 * @property {string} coordinateSystems.epsg -EPSG code. (/options/tools/searchCoordinates/showCoordinates/items/epsg)
 * @property {string} coordinateSystems.name - Name of coordinate system. (/options/tools/showCoordinates/coordinateSystems/items/name)
 * @property {string|null} div - DIV ID. (/options/tools/showCoordinates/div)
 * @property {string} style - CSS Class used for styling. (/options/tools/showCoordinates/style)
 */
/**
 * Create showCoordinates Control
 * @typedef {function} CONTROL_FACTORIES_showCoordinates
 * @param {object} map - Map object
 * @param {string} controlName - Name of control (showCoordinates)
 * @param {object} options - Control options. See properties in {@link showCoordinates_options}
 * @param {object} panel - Panel object
 * @param {object} standardPositionControls - Object with standardPositionControls
 * @returns {object}
 */
/**
 * @typedef {object} staticLinks_options
 * @property {string} position - Position of control. It will be used only if div is null. Values: 'top-left', 'top-right', 'bottom-left', 'bottom-right' or CSS properties (e.g. 'left: 5px; top: 10px;'). (/options/tools/staticLinks/items/position)
 * @property {string|null} div - DIV ID. (/options/tools/staticLinks/items/div)
 * @property {string} style - CSS Class used for styling. (/options/tools/staticLinks/items/style)
 * @property {string} url - URL for link. (/options/tools/staticLinks/items/url)
 * @property {string} title - Title for link shown on hover. (/options/tools/staticLinks/items/title)
 * @property {string} content - Content for link. Markup is allowed. (/options/tools/staticLinks/items/content)
 * @property {boolean} onlyFullScreen - Link available only in full screen mode. (/options/tools/staticLinks/items/onlyFullScreen)
 */
/**
 * Create staticLinks Control
 * @typedef {function} CONTROL_FACTORIES_staticLinks
 * @param {object} map - Map object
 * @param {string} controlName - Name of control (staticLinks)
 * @param {object} options - Control options. See properties in {@link staticLinks_options}
 * @param {object} panel - Panel object
 * @param {object} standardPositionControls - Object with standardPositionControls
 * @returns {object}
 */
/**
 * @typedef {object} staticWindows_options
 * @property {boolean} active - Should window be initially open or close. (/options/tools/staticWindows/active)
 * @property {string} position - Position of control. It will be used only if div is null. Values: 'top-left', 'top-right', 'bottom-left', 'bottom-right' or CSS properties (e.g. 'left: 5px; top: 10px;'). (/options/tools/staticWindows/items/position)
 * @property {string|null} div - DIV ID. (/options/tools/staticWindows/items/div)
 * @property {string} style - CSS Class used for styling. (/options/tools/staticWindows/items/style)
 * @property {integer[]} size - Size of window in pixel [width, height]. (/options/tools/staticWindows/items/size)
 * @property {string} title - Title for link shown on hover. (/options/tools/staticWindows/items/title)
 * @property {string} content - Content for link. Markup is allowed. (/options/tools/staticWindows/items/content)
 * @property {boolean} onlyFullScreen - Link available only in full screen mode. (/options/tools/staticWindows/items/onlyFullScreen)
 */
/**
 * Create staticWindows Control
 * @typedef {function} CONTROL_FACTORIES_staticWindows
 * @param {object} map - Map object
 * @param {string} controlName - Name of control (staticWindows)
 * @param {object} options - Control options. See properties in {@link staticWindows_options}
 * @param {object} panel - Panel object
 * @returns {object}
 */
/**
 * @typedef {object} copyright_options
 * @property {boolean} active - Activate tool. (/options/tools/copyright/active)
 * @property {string} position - Position of control. It will be used only if div is null. Values: 'top-left', 'top-right', 'bottom-left', 'bottom-right' or CSS properties (e.g. 'left: 5px; top: 10px;'). (/options/tools/copyright/position)
 * @property {string|null} div - DIV ID. (/options/tools/copyright/div)
 * @property {string} style - CSS Class used for styling. (/options/tools/copyright/style)
 * @property {string} maxWidth - Maximum width of copyright div (e.g. '200px'). (/options/tools/copyright/maxWidth)
 * @property {string} maxHeight - Maximum height of copyright div (e.g. '100px'). (/options/tools/copyright/maxHeight)
 * @property {boolean} onlyFullScreen - Tool available only in full screen mode. (/options/tools/copyright/onlyFullScreen)
 */
/**
 * Create copyright Control
 * @typedef {function} CONTROL_FACTORIES_copyright
 * @param {object} map - Map object
 * @param {string} controlName - Name of control (copyright)
 * @param {object} options - Control options. See properties in {@link copyright_options}
 * @param {object} panel - Panel object
 * @param {object} standardPositionControls - Object with standardPositionControls
 * @returns {object}
 */
/**
 * Method to create searchPanel Control
 * @typedef {function} CONTROL_FACTORIES_searchPanel
 * @param {object} map - Map object
 * @param {string} controlName - Name of control (searchpanel)
 * @param {boolean} geoSearch - Is there a geoSearch control available
 * @param {object} panel - Panel object
 * @returns {object}
 */
/**
 * Create infoPanel Control
 * @typedef {function} CONTROL_FACTORIES_infoPanel
 * @param {object} map - Map object
 * @param {string} controlName - Name of control (infoPanel)
 * @param {null} options - InfoPlanel options. Currently not used.
 * @param {object} panel - Panel object
 * @returns {object}
 */
/**
 * @typedef {object} geoSearch_options
 * @property {boolean} active - Activate tool. (/options/tools/geoSearch/active)
 * @property {string|null} div - DIV ID. (/options/tools/geoSearch/div)
 * @property {string} style - CSS Class used for styling. (/options/tools/geoSearch/style)
 * @property {integer|null} resultsMaxZoom - Max value for zooming to result features. (/options/tools/geoSearch/resultsMaxZoom)
 * @property {integer|null} suggestCount - Suggestion results that will be fetched. (/options/tools/geoSearch/suggestCount)
 * @property {integer|null} resultsCount - Results that will be fetched. (/options/tools/geoSearch/resultsCount)
 * @property {string|null} templatePopup - Template for popups (e.g. "< b>$text< /b>< br/>$typ< br/>($geometry.x $geometry.y)"). (/options/tools/geoSearch/templatePopup)
 * @property {string|null} templateList - Template for results list. (e.g. "< b>$text< /b>< br/>$typ< br/>($geometry.x $geometry.y)"). (/options/tools/geoSearch/templateList)
 * @property {object} protocol - Protocol used for geoSearch control. (/options/tools/geoSearch/protocol)
 */
/**
 * Create geoSearch Control
 * @typedef {function} CONTROL_FACTORIES_geoSearch
 * @param {object} map - Map object
 * @param {string} controlName - Name of control (geoSearch)
 * @param {object} options - Control options. See properties in {@link geoSearch_options}
 * @param {object} panel - Panel object
 * @returns {object}
 */
/**
 * @typedef {object} searchCoordinates_options
 * @property {boolean} active - Activate tool. (/options/tools/searchCoordinates/active)
 * @property {string|null} div - DIV ID. (/options/tools/searchCoordinates/div)
 * @property {string} style - CSS Class used for styling. (/options/tools/searchCoordinates/style)
 * @property {object[]} coordinateSystems - Coordinate systems for dropdown menu. (/options/tools/searchCoordinates/coordinateSystems) <br> <b>Below are properties of each Object in Array:</b>
 * @property {string} coordinateSystems.epsg -EPSG code. (/options/tools/searchCoordinates/coordinateSystems/items/epsg)
 * @property {string} coordinateSystems.name - Name of coordinate system. (/options/tools/searchCoordinates/coordinateSystems/items/name)
 */
/**
 * Create searchCoordinates Control
 * @typedef {function} CONTROL_FACTORIES_searchCoordinates
 * @param {object} map - Map object
 * @param {string} controlName - Name of control (searchCoordinates)
 * @param {object} options - Control options. See properties in {@link searchCoordinates_options}
 * @param {object} panel - Panel object
 * @returns {object}
 */
/**
 * @typedef {object} copyCoordinates_options
 * @property {boolean} active - Activate tool. (/options/tools/copyCoordinates/active)
 * @property {string|null} div - DIV ID. (/options/tools/copyCoordinates/div)
 * @property {string} style - CSS Class used for styling. (/options/tools/copyCoordinates/style)
 * @property {object[]} coordinateSystems - Coordinate systems for dropdown menu. (/options/tools/copyCoordinates/coordinateSystems) <br> <b>Below are properties of each Object in Array:</b>
 * @property {string} coordinateSystems.epsg -EPSG code. (/options/tools/searchCoordinates/copyCoordinates/items/epsg)
 * @property {string} coordinateSystems.name - Name of coordinate system. (/options/tools/copyCoordinates/coordinateSystems/items/name)
 */
/**
 * Create copyCoordinates Control
 * @typedef {function} CONTROL_FACTORIES_copyCoordinates
 * @param {object} map - Map object
 * @param {string} controlName - Name of control (copyCoordinates)
 * @param {object} options - Control options. See properties in {@link copyCoordinates_options}
 * @param {object} panel - Panel object
 * @returns {object}
 */
/**
 * @typedef {object} share_options
 * @property {boolean} active - Activate tool. (/options/tools/share/active)
 * @property {string|null} div - DIV ID. (/options/tools/share/div)
 * @property {string} style - CSS Class used for styling. (/options/tools/share/style)
 * @property {object} print - Print map. (/options/tools/share/print)
 * @property {boolean} print.active - Activate tool. (/options/tools/share/print/active)
 * @property {string} print.stylesheet - URL of stylesheet file that can be used when printing. (/options/tools/share/print/stylesheet)
 * @property {object} permaLink - Use URL paramaters for exporting-importing map status. (/options/tools/share/permaLink)
 * @property {boolean} permaLink.active - Activate tool. (/options/tools/share/permaLink/active)
 * @property {object} jsonExport - Export-Import JSON with current status of application. (/options/tools/share/jsonExport)
 * @property {boolean} jsonExport.active - Activate tool. (/options/tools/share/jsonExport/active)
 * @property {string} jsonExport.appName - Name of BKG Webmap implementation that will be used in exported JSON. (/options/tools/share/jsonExport/appName)
 */
/**
 * Create share Control
 * @typedef {function} CONTROL_FACTORIES_share
 * @param {object} map - Map object
 * @param {string} controlName - Name of control (share)
 * @param {object} options - Control options. See properties in {@link share_options}
 * @param {object} panel - Panel object
 * @returns {object}
 */
/**
 * Create print Control
 * @typedef {function} CONTROL_FACTORIES_print
 * @param {object} map - Map object
 * @param {object} options - Control options.
 * @param {boolean} options.active - Activate tool. (/options/tools/share/print/active)
 * @param {string} options.stylesheet - URL of stylesheet file that can be used when printing. (/options/tools/share/print/stylesheet)
 * @param {object} panel - Panel object
 * @returns {object}
 */
/**
 * @typedef {object} customLayers_options
 * @property {boolean} active - Activate tool. (/options/tools/customLayers/active)
 * @property {boolean} edit - Enable editing for custom layer. (/options/tools/customLayers/edit)
 * @property {boolean} changeVisibility - User can change visibility of custom layers. (/options/tools/customLayers/changeVisibility)
 * @property {string} defaultStyle - Default style of custom vector layers. Use /styles/items/name. (/options/tools/customLayers/defaultStyle)
 * @property {string[]} dataTypes - Layer types. (Values in array: "BKG", "WMS", "WMTS", "WFS", "CSV", "XLS", "GPS") (/options/tools/customLayers/dataTypes)
 */
/**
 * Create customLayers Control
 * @typedef {function} CONTROL_FACTORIES_customLayers
 * @param {object} map - Map object
 * @param {string} controlName - Name of control (customLayers)
 * @param {object} options - Control options. See properties in {@link customLayers_options}
 * @param {object} panel - Panel object
 * @returns {object}
 */
/**
 * Create permaLink Control
 * @typedef {function} CONTROL_FACTORIES_permaLink
 * @param {object} map - Map object
 * @returns {object}
 */
/**
 * Create jsonExport Control
 * @typedef {function} CONTROL_FACTORIES_jsonExport
 * @param {object} map - Map object
 * @param {object} options - Control options.
 * @param {boolean} options.active - Activate tool. (/options/tools/share/jsonExport/active)
 * @param {string} options.appName - Name of BKG Webmap implementation that will be used in exported JSON. (/options/tools/share/jsonExport/appName)
 * @param {object} panel - Panel object
 * @returns {object}
 */
/**
 * Create cookieCheck Control
 * @typedef {function} CONTROL_FACTORIES_cookieCheck
 * @param {object} map - Map object
 * @param {string} controlName - Name of control (cookieCheck)
 * @param {object} options - Control options.
 * @returns {object}
 */
/**
 * @typedef {object} overviewMap_options
 * @property {boolean} active - Activate tool. (/options/tools/overviewMap/active)
 * @property {string} position - Position of control. It will be used only if div is null. Values: 'top-left', 'top-right', 'bottom-left', 'bottom-right' or CSS properties (e.g. 'left: 5px; top: 10px;'). (/options/tools/overviewMap/position)
 * @property {string|null} div - DIV ID. (/options/tools/overviewMap/div)
 * @property {boolean} collapsible - Overview map can be collapsed. (/options/tools/overviewMap/collapsible)
 * @property {boolean} collapsed - Overview map should start collapsed. (/options/tools/overviewMap/collapsed)
 * @property {array|null} layers - Array with layer IDs that should be shown in overview map. If empty or null, all layers will be used.. (/options/tools/overviewMap/layers)
 * @property {boolean} onlyFullScreen - Link available only in full screen mode. (/options/tools/overviewMap/items/onlyFullScreen)
 */
/**
 * Create overviewMap Control
 * @typedef {function} CONTROL_FACTORIES_overviewMap
 * @param {object} map - Map object
 * @param {string} controlName - Name of control (overviewMap)
 * @param {object} options - Control options. See properties in {@link overviewMap_options}
 * @param {object} panel - Panel object
 * @param {object} standardPositionControls - Object with standardPositionControls
 * @returns {object}
 */
/**
 * @typedef {object} timeSlider_options
 * @property {boolean} active - Activate tool. (/options/tools/timeSlider/active)
 * @property {string} position - Position of control. It will be used only if div is null. Values: 'top-left', 'top-right', 'bottom-left', 'bottom-right' or CSS properties (e.g. 'left: 5px; top: 10px;'). (/options/tools/timeSlider/position)
 * @property {string|null} div - DIV ID. (/options/tools/timeSlider/div)
 * @property {string} style - CSS Class used for styling. (/options/tools/timeSlider/style)
 */
/**
 * Create timeSlider Control
 * @typedef {function} CONTROL_FACTORIES_timeSlider
 * @param {object} map - Map object
 * @param {string} controlName - Name of control (timeSlider)
 * @param {object} options - Control options. See properties in {@link timeSlider_options}
 * @param {object} panel - Panel object
 * @param {object} standardPositionControls - Object with standardPositionControls
 * @returns {object}
 */
/**
 * Create marker Control
 * @typedef {function} CONTROL_FACTORIES_marker
 * @param {object} map - Map object
 * @returns {object}
 */
/**
 * Factory functions to generate controls
 * @type {object}
 * @memberof BKGWebMap.Control
 * @property {function} standardPosition - Method to create four standard positions for map controls (top-left, top-right, bottom-left, bottom-right). See {@link CONTROL_FACTORIES_standardPosition}
 * @property {function} geoSearch - Method to create geoSearch Control. See {@link CONTROL_FACTORIES_geoSearch}
 * @property {function} searchCoordinates - Method to create searchCoordinates Control. See {@link CONTROL_FACTORIES_searchCoordinates}
 * @property {function} layerSwitcher - Method to create layerSwitcher Control. See {@link CONTROL_FACTORIES_layerSwitcher}
 * @property {function} customLayers - Method to create customLayers Control. See {@link CONTROL_FACTORIES_customLayers}
 * @property {function} legend - Method to create legend Control. See {@link CONTROL_FACTORIES_legend}
 * @property {function} showAttributes - Method to create showAttributes Control. See {@link CONTROL_FACTORIES_showAttributes}
 * @property {function} copyCoordinates - Method to create copyCoordinates Control. See {@link CONTROL_FACTORIES_copyCoordinates}
 * @property {function} measure - Method to create measure Control. See {@link CONTROL_FACTORIES_measure}
 * @property {function} edit - Method to create measure Control. See {@link CONTROL_FACTORIES_edit}
 * @property {function} share - Method to create share Control. See {@link CONTROL_FACTORIES_share}
 * @property {function} zoom - Method to create zoom Control. See {@link CONTROL_FACTORIES_zoom}
 * @property {function} scalebar - Method to create scalebar Control. See {@link CONTROL_FACTORIES_scalebar}
 * @property {function} copyright - Method to create copyright Control. See {@link CONTROL_FACTORIES_copyright}
 * @property {function} showCoordinates - Method to create showCoordinates Control. See {@link CONTROL_FACTORIES_showCoordinates}
 * @property {function} staticLinks - Method to create staticLinks Control. See {@link CONTROL_FACTORIES_staticLinks}
 * @property {function} staticWindows - Method to create staticWindows Control. See {@link CONTROL_FACTORIES_staticWindows}
 * @property {function} fullScreen - Method to create fullScreen Control. See {@link CONTROL_FACTORIES_fullScreen}
 * @property {function} overviewMap - Method to create overviewMap Control. See {@link CONTROL_FACTORIES_overviewMap}
 * @property {function} timeSlider - Method to create timeSlider Control. See {@link CONTROL_FACTORIES_timeSlider}
 * @property {function} panel - Method to create panel Control. See {@link CONTROL_FACTORIES_panel}
 * @property {function} searchPanel - Method to create searchPanel Control. See {@link CONTROL_FACTORIES_searchPanel}
 * @property {function} infoPanel - Method to create infoPanel Control. See {@link CONTROL_FACTORIES_infoPanel}
 * @property {function} print - Method to create print Control. See {@link CONTROL_FACTORIES_print}
 * @property {function} permaLink - Method to create permaLink Control. See {@link CONTROL_FACTORIES_permaLink}
 * @property {function} jsonExport - Method to create jsonExport Control. See {@link CONTROL_FACTORIES_jsonExport}
 * @property {function} cookieCheck - Method to create cookieCheck Control. See {@link CONTROL_FACTORIES_cookieCheck}
 * @property {function} marker - Method to create marker Control. See {@link CONTROL_FACTORIES_marker}
 */
BKGWebMap.Control.FACTORIES = {
    standardPosition: function () {
        var standardPositionControls = {};
        for (var i = 0; i < BKGWebMap.STANDARD_POSITION.length; i++) {
            standardPositionControls[BKGWebMap.STANDARD_POSITION[i]] = BKGWebMap.Control.createStandardPosition(BKGWebMap.STANDARD_POSITION[i]);
            ol.inherits(standardPositionControls[BKGWebMap.STANDARD_POSITION[i]], ol.control.Control);
        }
        return standardPositionControls;
    },
    panel: function () {
        BKGWebMap.Control.Panel = BKGWebMap.Control.createPanel();
        ol.inherits(BKGWebMap.Control.Panel, ol.control.Control);
        return BKGWebMap.Control.Panel;
    },
    layerSwitcher: function () {
        BKGWebMap.Control.LayerSwitcher = BKGWebMap.Control.createLayerSwitcher();
        ol.inherits(BKGWebMap.Control.LayerSwitcher, ol.control.Control);
        return BKGWebMap.Control.LayerSwitcher;
    },
    showAttributes: function () {
        BKGWebMap.Control.ShowAttributes = BKGWebMap.Control.createShowAttributes();
        ol.inherits(BKGWebMap.Control.ShowAttributes, ol.control.Control);
        return BKGWebMap.Control.ShowAttributes;
    },
    legend: function () {
        BKGWebMap.Control.Legend = BKGWebMap.Control.createLegend();
        ol.inherits(BKGWebMap.Control.Legend, ol.control.Control);
        return BKGWebMap.Control.Legend;
    },
    zoom: function () {
        BKGWebMap.Control.Zoom = BKGWebMap.Control.createZoom();
        ol.inherits(BKGWebMap.Control.Zoom, ol.control.Control);
        return BKGWebMap.Control.Zoom;
    },
    fullScreen: function () {
        BKGWebMap.Control.FullScreen = BKGWebMap.Control.createFullScreen();
        ol.inherits(BKGWebMap.Control.FullScreen, ol.control.FullScreen);
        return BKGWebMap.Control.FullScreen;
    },
    measure: function () {
        BKGWebMap.Control.Measure = BKGWebMap.Control.createMeasure();
        ol.inherits(BKGWebMap.Control.Measure, ol.control.Control);
        return BKGWebMap.Control.Measure;
    },
    edit: function () {
        BKGWebMap.Control.Edit = BKGWebMap.Control.createEdit();
        ol.inherits(BKGWebMap.Control.Edit, ol.control.Control);
        return BKGWebMap.Control.Edit;
    },
    scalebar: function () {
        BKGWebMap.Control.Scalebar = BKGWebMap.Control.createScalebar();
        ol.inherits(BKGWebMap.Control.Scalebar, ol.control.Control);
        return BKGWebMap.Control.Scalebar;
    },
    showCoordinates: function () {
        BKGWebMap.Control.ShowCoordinates = BKGWebMap.Control.createShowCoordinates();
        ol.inherits(BKGWebMap.Control.ShowCoordinates, ol.control.Control);
        return BKGWebMap.Control.ShowCoordinates;
    },
    staticLinks: function (i) {
        BKGWebMap.Control['StaticLinks' + i] = BKGWebMap.Control.createStaticLinks();
        ol.inherits(BKGWebMap.Control['StaticLinks' + i], ol.control.Control);
        return BKGWebMap.Control['StaticLinks' + i];
    },
    staticWindows: function (i) {
        BKGWebMap.Control['StaticWindows' + i] = BKGWebMap.Control.createStaticWindows();
        ol.inherits(BKGWebMap.Control['StaticWindows' + i], ol.control.Control);
        return BKGWebMap.Control['StaticWindows' + i];
    },
    copyright: function () {
        BKGWebMap.Control.Copyright = BKGWebMap.Control.createCopyright();
        ol.inherits(BKGWebMap.Control.Copyright, ol.control.Control);
        return BKGWebMap.Control.Copyright;
    },
    searchPanel: function () {
        BKGWebMap.Control.SearchPanel = BKGWebMap.Control.createSearchPanel();
        ol.inherits(BKGWebMap.Control.SearchPanel, ol.control.Control);
        return BKGWebMap.Control.SearchPanel;
    },
    infoPanel: function () {
        BKGWebMap.Control.InfoPanel = BKGWebMap.Control.createInfoPanel();
        ol.inherits(BKGWebMap.Control.InfoPanel, ol.control.Control);
        return BKGWebMap.Control.InfoPanel;
    },

    geoSearch: function () {
        BKGWebMap.Control.GeoSearch = BKGWebMap.Control.createGeoSearch();
        ol.inherits(BKGWebMap.Control.GeoSearch, ol.control.Control);
        return BKGWebMap.Control.GeoSearch;
    },
    searchCoordinates: function () {
        BKGWebMap.Control.SearchCoordinates = BKGWebMap.Control.createSearchCoordinates();
        ol.inherits(BKGWebMap.Control.SearchCoordinates, ol.control.Control);
        return BKGWebMap.Control.SearchCoordinates;
    },
    copyCoordinates: function () {
        BKGWebMap.Control.CopyCoordinates = BKGWebMap.Control.createCopyCoordinates();
        ol.inherits(BKGWebMap.Control.CopyCoordinates, ol.control.Control);
        return BKGWebMap.Control.CopyCoordinates;
    },
    share: function () {
        BKGWebMap.Control.Share = BKGWebMap.Control.createShare();
        ol.inherits(BKGWebMap.Control.Share, ol.control.Control);
        return BKGWebMap.Control.Share;
    },
    print: function () {
        BKGWebMap.Control.Print = BKGWebMap.Control.createPrint();
        ol.inherits(BKGWebMap.Control.Print, ol.control.Control);
        return BKGWebMap.Control.Print;
    },
    customLayers: function () {
        BKGWebMap.Control.CustomLayers = BKGWebMap.Control.createCustomLayers();
        ol.inherits(BKGWebMap.Control.CustomLayers, ol.control.Control);
        return BKGWebMap.Control.CustomLayers;
    },
    permaLink: function () {
        BKGWebMap.Control.PermaLink = BKGWebMap.Control.createPermaLink();
        return BKGWebMap.Control.PermaLink;
    },
    jsonExport: function () {
        BKGWebMap.Control.JsonExport = BKGWebMap.Control.createJsonExport();
        ol.inherits(BKGWebMap.Control.JsonExport, ol.control.Control);
        return BKGWebMap.Control.JsonExport;
    },
    cookieCheck: function () {
        BKGWebMap.Control.CookieCheck = BKGWebMap.Control.createCookieCheck();
        ol.inherits(BKGWebMap.Control.CookieCheck, ol.control.Control);
        return BKGWebMap.Control.CookieCheck;
    },
    overviewMap: function () {
        BKGWebMap.Control.OverviewMap = BKGWebMap.Control.createOverviewMap();
        ol.inherits(BKGWebMap.Control.OverviewMap, ol.control.Control);
        return BKGWebMap.Control.OverviewMap;
    },
    timeSlider: function () {
        BKGWebMap.Control.TimeSlider = BKGWebMap.Control.createTimeSlider();
        ol.inherits(BKGWebMap.Control.TimeSlider, ol.control.Control);
        return BKGWebMap.Control.TimeSlider;
    },
    marker: function () {
        BKGWebMap.Control.Marker = BKGWebMap.Control.createMarker();
        ol.inherits(BKGWebMap.Control.Marker, ol.control.Control);
        return BKGWebMap.Control.Marker;
    }
};

/**
 * Object with all BKG Webmap Controls used in application
 * @type {object}
 */
BKGWebMap.Controls = BKGWebMap.Controls || {};
