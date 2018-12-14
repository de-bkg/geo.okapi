/**
 * Create timeSlider Control
 * @type function
 * @returns {function} See parameters of return function in {@link BKGWebMap.Control.FACTORIES.timeSlider}
 */
BKGWebMap.Control.createTimeSlider = function () {
    return function (map, controlName, options, panel, standardPositionControls) {
        var mapDivId = map.getTarget();
        var layerInfo = {};

        // Check if control should be created
        if (options.active === false) {
            return undefined;
        }

        // Find div ID for control
        var target;
        if (options.div && options.div !== '') {
            target = options.div;
        }
        var position;
        var cssPosition = false;

        if (target === undefined) {
            if (typeof options.position === 'string' && BKGWebMap.STANDARD_POSITION.indexOf(options.position) !== -1) {
                position = options.position;
            } else if (typeof options.position === 'string' && options.position.match(/top|left|bottom|right/)) {
                cssPosition = true;
                position = BKGWebMap.Util.cssParser(options.position);
            } else {
                position = BKGWebMap.CONTROLS.tools.timeSlider.position;
            }
        }

        var timeSlider = document.createElement('div');
        timeSlider.className = 'bkgwebmap-timeslider ol-unselectable ol-control';

        var tooltipExtraClass = ' bkgwebmap-tooltipinmaptext';
        var mapDivMiddle = document.getElementById(mapDivId).offsetWidth / 2;

        if (position !== undefined) {
            if (!cssPosition && standardPositionControls[position]) {
                var targetClass = standardPositionControls[position].getClass();
                target = document.getElementById(mapDivId).getElementsByClassName(targetClass)[0];
                var rightLeft = position.split('-')[1];
                timeSlider.classList.add('bkgwebmap-standardpositioncontrol', 'bkgwebmap-standardpositioncontrol' + rightLeft);
                if (rightLeft === 'right') {
                    tooltipExtraClass = ' bkgwebmap-tooltiptimesliderright';
                }
            } else if (cssPosition) {
                for (var prop in position) {
                    if (prop === 'left' && parseInt(position.left, 10) > mapDivMiddle) {
                        timeSlider.style.right = document.getElementById(mapDivId).offsetWidth - parseInt(position.left, 10) + 'px';
                    } else {
                        timeSlider.style[prop] = position[prop];
                    }
                }
            } else {
                return undefined;
            }
        }
        // Custom class
        var customClass = '';
        if (options.style && options.style !== '') {
            customClass = options.style;
            timeSlider.classList.add(customClass);
        }

        // Create DOM
        var timeSliderButton = document.createElement('button');
        timeSliderButton.className = 'bkgwebmap-mapbutton bkgwebmap-timesliderbutton bkgwebmap-paneltooltip';
        if (position === 'bottom-right' || position === 'top-right' || (cssPosition && parseInt(position.left, 10) > mapDivMiddle) || (cssPosition && parseInt(position.right, 10) < mapDivMiddle)) {
            timeSliderButton.style.float = 'right';
        } else {
            timeSliderButton.style.float = 'left';
        }

        var parser = new DOMParser();
        var newIcon = parser.parseFromString(BKGWebMap.PANEL_ICONS.TIMESLIDER, 'text/xml');
        timeSliderButton.appendChild(newIcon.documentElement);

        var timeSliderTooltip = document.createElement('span');
        timeSliderTooltip.className = 'bkgwebmap-paneltooltiptext bkgwebmap-tooltiptimeslider' + tooltipExtraClass;
        timeSliderTooltip.innerHTML = 'Zeitschieberegler';
        timeSliderButton.appendChild(timeSliderTooltip);

        var timeSliderSelect = document.createElement('select');
        timeSliderSelect.className = 'bkgwebmap-timesliderselect';
        var timeSliderSelectDiv = document.createElement('div');
        timeSliderSelectDiv.className = 'bkgwebmap-timesliderselectdiv';

        timeSliderSelectDiv.appendChild(timeSliderSelect);

        var timeSliderInput = document.createElement('input');
        timeSliderInput.setAttribute('type', 'range');
        timeSliderInput.className = 'bkgwebmap-timesliderinput';

        var timeSliderSingleInput = document.createElement('div');
        timeSliderSingleInput.className = 'bkgwebmap-timeslidersingleinput';
        timeSliderSingleInput.appendChild(timeSliderInput);

        var timeSliderOutput = document.createElement('output');
        timeSliderOutput.className = 'bkgwebmap-timeslidervalue';

        var timeSliderOutputDiv = document.createElement('div');
        timeSliderOutputDiv.className = 'bkgwebmap-timeslideroutputdiv';
        timeSliderOutputDiv.appendChild(timeSliderOutput);

        var timeSliderSpinner = document.createElement('a');
        timeSliderSpinner.className = 'bkgwebmap-timesliderspinner';
        timeSliderSpinner.setAttribute('href', 'javascript:void(0)');

        var timeSliderInputDiv = document.createElement('div');
        timeSliderInputDiv.className = 'bkgwebmap-timesliderinputdiv';

        timeSliderInputDiv.appendChild(timeSliderSingleInput);
        timeSliderInputDiv.appendChild(timeSliderOutputDiv);

        var timeSliderPeriodDiv = document.createElement('div');
        timeSliderPeriodDiv.className = 'bkgwebmap-timesliderperioddiv';

        var timeSliderPeriodInput = document.createElement('input');
        timeSliderPeriodInput.type = 'checkbox';
        timeSliderPeriodInput.className = 'bkgwebmap-timesliderperiod';

        var timeSliderLabelPeriod = document.createElement('label');
        timeSliderLabelPeriod.innerHTML = 'Zeitintervall';

        timeSliderPeriodDiv.appendChild(timeSliderPeriodInput);
        timeSliderPeriodDiv.appendChild(timeSliderLabelPeriod);

        var timeSliderDiv = document.createElement('div');
        timeSliderDiv.className = 'bkgwebmap-timesliderdiv';
        timeSliderDiv.style.display = 'none';

        timeSliderDiv.appendChild(timeSliderPeriodDiv);
        timeSliderDiv.appendChild(timeSliderInputDiv);
        timeSliderDiv.appendChild(timeSliderSelectDiv);

        timeSlider.appendChild(timeSliderButton);
        timeSlider.appendChild(timeSliderDiv);

        var timeSliderMultipleInputDiv = document.createElement('div');
        timeSliderMultipleInputDiv.className = 'bkgwebmap-timeslidermultiplediv';

        var timeSliderMultipleInput = document.createElement('div');
        timeSliderMultipleInput.className = 'bkgwebmap-timeslidermultiple';

        var timeSliderHandle = document.createElement('div');
        timeSliderHandle.className = 'bkgwebmap-timesliderhandle';

        var timeSliderFill = document.createElement('div');
        timeSliderFill.className = 'bkgwebmap-timesliderfill';

        timeSliderPeriodInput.addEventListener('change', function () {
            var layerId = timeSliderSelect.value;
            var periodInput = this.checked;
            initTimeSlider(layerId, periodInput);
        });

        timeSliderSelect.addEventListener('change', function () {
            var layerId = timeSliderSelect.value;
            var periodInput = layerInfo[layerId].period;
            initTimeSlider(layerId, periodInput);
        });

        var timeSliderModes = ['period', 'time', 'all'];

        this.addLayerInTimeSlider = function (layer) {
            if (layer instanceof BKGWebMap.Layer.ImageWMS || layer instanceof BKGWebMap.Layer.TileWMS) {
                var timeInfo = layer.getTimeInfo();
                var layerId = layer.get('uniqueId');
                var config = layer.getProperties().originalConfig;
                var optionTimeSlider;
                var initPeriod;
                var initFormat;
                // Timeslider mode by default is 'all'
                var initMode = 'all';
                if ((timeInfo && Object.keys(timeInfo).length) || (config.time && config.time.active && config.time.values)) {
                    // Collect layer info and add to select menu
                    optionTimeSlider = document.createElement('option');
                    optionTimeSlider.value = layerId;
                    optionTimeSlider.innerHTML = layer.get('name');
                    timeSliderSelect.appendChild(optionTimeSlider);
                    timeSliderSelect.value = layerId;
                    layerInfo[layerId] = {};
                    if (config && config.time) {
                        if (config.time.mode && timeSliderModes.indexOf(config.time.mode) !== -1) {
                            initMode = config.time.mode;
                        }
                        if ((config.time.default && initMode !== 'time' && config.time.default.indexOf('/') !== -1) || initMode === 'period') {
                            initPeriod = true;
                        }
                        if (config.time.format && (config.time.format.indexOf('yy') !== -1 || config.time.format.indexOf('mm') !== -1 || config.time.format.indexOf('dd') !== -1)) {
                            initFormat = config.time.format;
                        }
                    }
                    layerInfo[layerId].mode = initMode;
                    layerInfo[layerId].period = initPeriod;
                    layerInfo[layerId].format = initFormat;

                    initTimeSlider(layerId, initPeriod);
                }
            }
        };

        var widthSlider;
        var widthStep;
        var multipleSlider = {};
        var wmsLayer;
        var singleSliderDiv;
        var singleOutputDiv;
        var singleSlider;
        var singleOutput;
        var minOutput;
        var maxOutput;
        var plusSpinner;
        var minusSpinner;

        function initTimeSlider(layerId, periodInput) {
            var inputDiv;
            var multipleOutputDiv;
            var mode = layerInfo[layerId].mode;
            if (position !== undefined) {
                inputDiv = document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-timesliderinputdiv')[0];
            } else if (document.getElementById(target) && document.getElementById(target).getElementsByClassName('bkgwebmap-timesliderinputdiv').length) {
                inputDiv = document.getElementById(target).getElementsByClassName('bkgwebmap-timesliderinputdiv')[0];
            } else {
                return;
            }
            // create DOM timeslider elements
            inputDiv.innerHTML = '';
            if (periodInput && mode !== 'time') {
                if (!timeSliderPeriodInput.checked || timeSliderPeriodInput.disabled) {
                    timeSliderPeriodInput.disabled = false;
                    timeSliderPeriodInput.checked = true;
                }
                timeSliderPeriodInput.disabled = mode === 'period';

                multipleSlider.input = timeSliderMultipleInput.cloneNode(false);
                multipleSlider.leftHandle = timeSliderHandle.cloneNode(false);
                multipleSlider.leftHandle.classList.add('bkgwebmap-timesliderlefthandle');
                multipleSlider.rightHandle = timeSliderHandle.cloneNode(false);
                multipleSlider.rightHandle.classList.add('bkgwebmap-timesliderrighthandle');
                multipleSlider.fill = timeSliderFill.cloneNode(false);
                multipleSlider.input.appendChild(multipleSlider.leftHandle);
                multipleSlider.input.appendChild(multipleSlider.rightHandle);
                multipleSlider.input.appendChild(multipleSlider.fill);
                inputDiv.appendChild(timeSliderMultipleInputDiv.cloneNode(false));
                inputDiv.firstChild.appendChild(multipleSlider.input);

                multipleOutputDiv = timeSliderOutputDiv.cloneNode(false);
                inputDiv.appendChild(multipleOutputDiv);
            } else {
                timeSliderPeriodInput.disabled = mode === 'time';
                if (timeSliderPeriodInput.checked) {
                    timeSliderPeriodInput.checked = false;
                }
                singleSliderDiv = timeSliderSingleInput.cloneNode(false);
                singleSliderDiv.appendChild(timeSliderInput.cloneNode(false));
                singleOutputDiv = timeSliderOutputDiv.cloneNode(false);
                singleSlider = singleSliderDiv.childNodes[0];
                inputDiv.appendChild(singleSliderDiv);
                inputDiv.appendChild(singleOutputDiv);
            }
            // get layer lime info and adjust timeslider
            map.getLayers().forEach(function (layer) {
                if (layer instanceof ol.layer.Group) {
                    layer.getLayers().forEach(function (grouplayer) {
                        if ((grouplayer instanceof BKGWebMap.Layer.ImageWMS || grouplayer instanceof BKGWebMap.Layer.TileWMS) && grouplayer.get('uniqueId') === layerId) {
                            wmsLayer = grouplayer;
                        }
                    });
                } else if ((layer instanceof BKGWebMap.Layer.ImageWMS || layer instanceof BKGWebMap.Layer.TileWMS) && layer.get('uniqueId') === layerId) {
                    wmsLayer = layer;
                }
            });
            if (wmsLayer === undefined) {
                return;
            }
            var config = wmsLayer.getProperties().originalConfig;
            var timeInfo = wmsLayer.getTimeInfo();
            var defaultValue;
            var valuesArray = !layerInfo[layerId].values ? parseTimeInfo(wmsLayer) : layerInfo[layerId].values;
            widthSlider = 200;
            widthStep = widthSlider / (valuesArray.length - 1);

            // create standart timeslider, if number of values < 50
            if (valuesArray.length <= 50) {
                widthStep = Math.floor(200 / (valuesArray.length - 1));
                if (widthStep < 2) {
                    widthStep = 2;
                }
                widthSlider = widthStep * (valuesArray.length - 1);
                timeSliderInputDiv.style.width = widthSlider + 'px';
            }

            if (!periodInput) {
                singleSlider.style.width = widthSlider + 'px';
                singleSlider.setAttribute('min', '0');
                singleSlider.setAttribute('max', valuesArray.length - 1);
                singleSlider.setAttribute('step', '1');
                if (layerInfo[wmsLayer.get('uniqueId')].lastValue && !layerInfo[wmsLayer.get('uniqueId')].period) {
                    singleSlider.value = layerInfo[wmsLayer.get('uniqueId')].lastValue;
                } else if (config.time.default && config.time.default.indexOf('/') === -1) {
                    defaultValue = new Date(config.time.default);
                    if (valuesArray.indexOf(defaultValue.getTime()) !== -1) {
                        singleSlider.value = valuesArray.indexOf(defaultValue.getTime());
                    }
                } else if (!config.time.default && timeInfo && timeInfo.default) {
                    defaultValue = new Date(timeInfo.default);
                    if (valuesArray.indexOf(defaultValue.getTime()) !== -1) {
                        singleSlider.value = valuesArray.indexOf(defaultValue.getTime());
                    }
                } else {
                    singleSlider.value = 0;
                }
                if (valuesArray.length <= 50) {
                    // output
                    singleOutputDiv.appendChild(timeSliderOutput.cloneNode(false));
                    singleOutput = singleOutputDiv.childNodes[0];
                    // input styles
                    singleSlider.style.background = '-webkit-repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent ' + widthStep + 'px) no-repeat 0px 50%';
                    singleSlider.style.background = '-moz-repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent ' + widthStep + 'px) no-repeat 0px 50%';
                    singleSlider.style.background = 'repeating-linear-gradient(90deg, #fff, #fff 1px, transparent 1px, transparent ' + widthStep + 'px) no-repeat 0px 50%;';
                    singleSlider.style.backgroundSize = widthSlider + 'px 15px';
                } else {
                    // singleOutput = timeSliderOutputDiv.cloneNode(false);
                    singleOutput = editableOutput(singleOutputDiv);
                    // inputDiv.appendChild(singleOutputDiv);
                    singleOutput.ondblclick = editOutput;
                }
                updateParams(false);
                // Event listner
                singleSlider.addEventListener('input', updateParams, { passive: true });
                // IE
                singleSlider.addEventListener('change', updateParams, { passive: true });
            } else {
                multipleSlider.input.style.width = widthSlider + 'px';
                if (valuesArray.length <= 50) {
                    // output
                    minOutput = timeSliderOutput.cloneNode(false);
                    minOutput.classList.add('bkgwebmap-timesliderminvalue');
                    maxOutput = timeSliderOutput.cloneNode(false);
                    maxOutput.classList.add('bkgwebmap-timeslidermaxvalue');
                    multipleOutputDiv.appendChild(maxOutput);
                    multipleOutputDiv.appendChild(minOutput);
                    multipleSlider.input.style.background = '-webkit-repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent ' + widthStep + 'px) no-repeat 0px 50%';
                    multipleSlider.input.style.background = '-moz-repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent ' + widthStep + 'px) no-repeat 0px 50%';
                    multipleSlider.input.style.background = 'repeating-linear-gradient(90deg, #fff, #fff 1px, transparent 1px, transparent ' + widthStep + 'px) no-repeat 0px 50%;';
                    multipleSlider.input.style.backgroundSize = widthSlider + 'px 15px';
                } else {
                    minOutput = editableOutput(multipleOutputDiv, 'bkgwebmap-timesliderminvalue');
                    maxOutput = editableOutput(multipleOutputDiv, 'bkgwebmap-timeslidermaxvalue');
                    minOutput.ondblclick = editOutput;
                    maxOutput.ondblclick = editOutput;
                }
                multipleSlider.max = valuesArray.length - 1;
                multipleSlider.min = 0;
                multipleSlider.leftHandle.style.left = '0%';
                multipleSlider.leftHandle.style.marginLeft = '-' + (multipleSlider.leftHandle.offsetWidth / 2) + 'px';
                multipleSlider.rightHandle.style.right = '50%';
                multipleSlider.rightHandle.style.marginRight = '-' + (multipleSlider.rightHandle.offsetWidth / 2) + 'px';
                multipleSlider.position = {};
                if (layerInfo[wmsLayer.get('uniqueId')].lastValue && layerInfo[wmsLayer.get('uniqueId')].period) {
                    multipleSlider.position.left = layerInfo[wmsLayer.get('uniqueId')].lastValue[0];
                    multipleSlider.position.right = layerInfo[wmsLayer.get('uniqueId')].lastValue[1];
                } else if (config.time.default && config.time.default.indexOf('/') !== -1) {
                    var defaultValueMin = new Date(config.time.default.substr(0, config.time.default.indexOf('/')));
                    multipleSlider.position.left = valuesArray.indexOf(defaultValueMin.getTime()) !== -1 && valuesArray.indexOf(defaultValueMin.getTime()) < valuesArray.length - 1 ? valuesArray.indexOf(defaultValueMin.getTime()) : 0;
                    var defaultValueMax = new Date(config.time.default.substr(config.time.default.indexOf('/') + 1, config.time.default.length - 1));
                    multipleSlider.position.right = valuesArray.indexOf(defaultValueMax.getTime()) !== -1 && defaultValueMax > defaultValueMin ? valuesArray.indexOf(defaultValueMax.getTime()) : valuesArray.length - 1;
                } else {
                    multipleSlider.position.left = 0;
                    multipleSlider.position.right = valuesArray.length - 1;
                }
                moveElements(multipleSlider.position, wmsLayer);
                // Event listner
                multipleSlider.leftHandle.onmousedown = startEvent;
                multipleSlider.leftHandle.ontouchstart = startEvent;
                multipleSlider.rightHandle.onmousedown = startEvent;
                multipleSlider.rightHandle.ontouchstart = startEvent;
                multipleSlider.input.onclick = adjustMultipleSlider;
            }
        }

        function editableOutput(outputDiv, className) {
            var outputWrapper = document.createElement('div');
            outputWrapper.className = 'bkgwebmap-timeslidervalue';
            if (className) {
                outputWrapper.classList.add(className);
            }
            var output = timeSliderOutput.cloneNode(false);
            output.classList.remove('bkgwebmap-timeslidervalue');

            minusSpinner = timeSliderSpinner.cloneNode(false);
            minusSpinner.classList.add('down');
            minusSpinner.innerHTML = '-';

            plusSpinner = timeSliderSpinner.cloneNode(false);
            plusSpinner.classList.add('up');
            plusSpinner.innerHTML = '+';

            outputWrapper.appendChild(minusSpinner);
            outputWrapper.appendChild(output);
            outputWrapper.appendChild(plusSpinner);

            outputDiv.appendChild(outputWrapper);

            minusSpinner.addEventListener('click', function (event) {
                changeValue(event.target.parentNode, event.target);
            });
            plusSpinner.addEventListener('click', function (event) {
                changeValue(event.target.parentNode, event.target);
            });
            return output;
        }

        function changeValue(slider, spinner, value) {
            var newValue;
            var params = layerInfo[wmsLayer.get('uniqueId')];
            if (slider.classList.contains('bkgwebmap-timesliderminvalue') || slider.classList.contains('bkgwebmap-timeslidermaxvalue')) {
                if (slider.classList.contains('bkgwebmap-timesliderminvalue')) {
                    if (spinner && spinner.classList.contains('up')) {
                        newValue = params.lastValue[0] + 1;
                    } else if (spinner && spinner.classList.contains('down')) {
                        newValue = params.lastValue[0] - 1;
                    } else {
                        newValue = value;
                    }
                    if (newValue < multipleSlider.position.right && newValue >= 0) {
                        multipleSlider.position.left = newValue;
                    }
                } else if (slider.classList.contains('bkgwebmap-timeslidermaxvalue')) {
                    if (spinner && spinner.classList.contains('up')) {
                        newValue = params.lastValue[1] + 1;
                    } else if (spinner && spinner.classList.contains('down')) {
                        newValue = params.lastValue[1] - 1;
                    } else {
                        newValue = value;
                    }
                    if (newValue > multipleSlider.position.left && newValue <= params.values.length - 1) {
                        multipleSlider.position.right = newValue;
                    }
                }
                moveElements(multipleSlider.position, wmsLayer);
            } else {
                if (spinner && spinner.classList.contains('up')) {
                    newValue = parseInt(singleSlider.value, 10) + 1;
                } else if (spinner && spinner.classList.contains('down')) {
                    newValue = parseInt(singleSlider.value, 10) - 1;
                } else {
                    newValue = value;
                }
                if (newValue >= 0 && newValue <= params.values.length - 1) {
                    singleSlider.value = newValue;
                    var evt = document.createEvent('HTMLEvents');
                    evt.initEvent('change', false, true);
                    singleSlider.dispatchEvent(evt);
                }
            }
        }

        // Get values from capabilities or config
        function parseTimeInfo(layer) {
            var defaultValues;
            var valuesArray;
            var config = layer.getProperties().originalConfig;
            var capabilitiesInfo = layer.getTimeInfo();
            var layerId = layer.get('uniqueId');
            if (capabilitiesInfo) {
                layer.getLayers().forEach(function (sublayer) {
                    for (var prop in capabilitiesInfo) {
                        if (prop === sublayer.layer) {
                            defaultValues = config.time.values ? config.time.values : capabilitiesInfo[prop].values;
                        }
                    }
                });
            } else {
                defaultValues = config.time.values;
            }
            valuesArray = getArray(defaultValues);
            layerInfo[layerId].values = valuesArray;
            return valuesArray;
        }

        function getArray(values) {
            var valuesArray = [];
            var minTime;
            var maxTime;
            var minTimeISO;
            var maxTimeISO;
            var timeResolution;
            var period;
            var i;
            var valuesArrayDefault;
            if (values.indexOf(',') !== -1) {
                singleSlider.value = 0;
                valuesArrayDefault = values.split(',');
                for (i = 0; i < valuesArrayDefault.length; i++) {
                    var dateISO = new Date(valuesArrayDefault[i]);
                    valuesArray[i] = dateISO.getTime();
                }
            } else if (values.indexOf('/') !== -1) {
                valuesArrayDefault = values.split('/');

                if (valuesArrayDefault.length === 3) {
                    minTimeISO = new Date(valuesArrayDefault[0]);
                    maxTimeISO = new Date(valuesArrayDefault[1]);
                    minTime = minTimeISO.getTime();
                    maxTime = maxTimeISO.getTime();
                    timeResolution = valuesArrayDefault[2];
                    if (isNaN(minTimeISO.getDate()) || isNaN(maxTimeISO.getDate())) {
                        return;
                    }
                } else if (valuesArrayDefault.length === 2) {
                    minTimeISO = new Date(valuesArrayDefault[0]);
                    minTime = minTimeISO.getTime();
                    maxTime = minTime;
                    timeResolution = valuesArrayDefault[1];
                    if (isNaN(minTimeISO.getDate())) {
                        return;
                    }
                }
                period = parseTimePeriod(timeResolution);
                valuesArray[0] = minTime;
                if (minTime !== maxTime) {
                    i = 0;
                    var newValue = minTime;
                    while (newValue < maxTime) {
                        i++;
                        var startTime = new Date(valuesArrayDefault[0]);
                        if (period.years) {
                            startTime.setUTCFullYear(startTime.getUTCFullYear() + i * period.years);
                        }
                        if (period.months) {
                            startTime.setUTCMonth(startTime.getUTCMonth() + i * period.months);
                        }
                        newValue = startTime.getTime() + i * (period.weeks * 7 * 24 * 60 * 60 + period.days * 24 * 60 * 60 + period.hours * 60 * 60 + period.minutes * 60 + period.seconds) * 1000;
                        if (newValue <= maxTime) {
                            valuesArray.push(newValue);
                        }
                    }
                }
            }
            return valuesArray;
        }

        function updateParams(period, dataLeft, dataRight) {
            var valuesArray = layerInfo[wmsLayer.get('uniqueId')].values;
            var format = layerInfo[wmsLayer.get('uniqueId')].format;
            if (period && !(period instanceof Event)) {
                var minDate = new Date(valuesArray[dataLeft]);
                var maxDate = new Date(valuesArray[dataRight]);
                if (minDate !== undefined) {
                    minOutput.innerHTML = dateToString(minDate);
                    minOutput.setAttribute('timevalue', valuesArray[dataLeft]);
                    if (valuesArray.length <= 50) {
                        positioningInputsTooltip(minOutput, multipleSlider.leftHandle);
                    } else {
                        positioningInputsTooltip(minOutput.parentNode, multipleSlider.leftHandle);
                    }
                }
                if (maxDate !== undefined) {
                    maxOutput.innerHTML = dateToString(maxDate);
                    maxOutput.setAttribute('timevalue', valuesArray[dataRight]);
                    if (valuesArray.length <= 50) {
                        positioningInputsTooltip(maxOutput, multipleSlider.rightHandle);
                    } else {
                        positioningInputsTooltip(maxOutput.parentNode, multipleSlider.rightHandle);
                    }
                }
                if (minDate !== undefined && maxDate !== undefined) {
                    wmsLayer.getSource().updateParams({ TIME: dateToFormat(minDate.getTime(), format) + '/' + dateToFormat(maxDate.getTime(), format) });
                    layerInfo[wmsLayer.get('uniqueId')].period = true;
                    layerInfo[wmsLayer.get('uniqueId')].lastValue = [dataLeft, dataRight];
                }
            } else {
                var currentDate = new Date(valuesArray[parseInt(singleSlider.value, 10)]);
                wmsLayer.getSource().updateParams({ TIME: dateToFormat(currentDate.getTime(), format) });
                singleOutput.innerHTML = dateToString(currentDate);
                singleOutput.setAttribute('timevalue', valuesArray[parseInt(singleSlider.value, 10)]);
                if (valuesArray.length <= 50) {
                    positioningInputsTooltip(singleOutput, singleSlider);
                } else {
                    positioningInputsTooltip(singleOutput.parentNode, singleSlider);
                }
                layerInfo[wmsLayer.get('uniqueId')].period = false;
                layerInfo[wmsLayer.get('uniqueId')].lastValue = singleSlider.value;
            }
        }

        function dateToFormat(date, format) {
            var formatDate = new Date(date);
            if (format) {
                if (format.indexOf('yyyy') > -1) {
                    format = format.replace('yyyy', formatDate.getUTCFullYear());
                } else if (format.indexOf('yy') > -1) {
                    format = format.replace('yy', formatDate.getUTCFullYear().slice(-2));
                }
                if (format.indexOf('mm')) {
                    format = format.replace('mm', formatDate.getUTCMonth());
                }
                if (format.indexOf('dd')) {
                    format = format.replace('dd', formatDate.getUTCDate());
                }
                formatDate = format;
            } else {
                formatDate = formatDate.toISOString();
            }
            return formatDate;
        }

        function editOutput(event) {
            var output = event.target;
            var timeValue = output.getAttribute('timevalue');
            var oldTime = new Date(parseInt(timeValue, 10));
            var wrapper = output.parentNode;

            for (var i = 0; i < wrapper.childNodes.length; i++) {
                wrapper.childNodes[i].style.display = 'none';
            }

            var input = document.createElement('input');
            input.className = 'bkgwebmap-timeslidereditinput';
            input.setAttribute('type', 'text');
            if (layerInfo[wmsLayer.get('uniqueId')].tooltipMode && layerInfo[wmsLayer.get('uniqueId')].tooltipMode === 'time') {
                input.value = oldTime.toISOString();
            } else {
                input.value = dateToString(oldTime);
            }
            wrapper.appendChild(input);
            input.focus();
            input.addEventListener('blur', function () {
                wrapper.removeChild(input);
                for (var i = 0; i < wrapper.childNodes.length; i++) {
                    wrapper.childNodes[i].style.display = 'inline-block';
                }
            });
            input.addEventListener('keydown', function (event) {
                if (event.key && event.key === 'Enter') {
                    var date;
                    if (layerInfo[wmsLayer.get('uniqueId')].tooltipMode && layerInfo[wmsLayer.get('uniqueId')].tooltipMode === 'time') {
                        date = new Date(input.value);
                    } else {
                        date = stringToDate(input.value, oldTime);
                    }
                    var time = date.getTime();
                    if (!isNaN(date.getDate()) && layerInfo[wmsLayer.get('uniqueId')].values.indexOf(time) !== -1) {
                        changeValue(wrapper, false, layerInfo[wmsLayer.get('uniqueId')].values.indexOf(time));
                    }
                    input.blur();
                }
            });
        }

        function dateToString(date) {
            var string;
            if (layerInfo[wmsLayer.get('uniqueId')].tooltipMode && layerInfo[wmsLayer.get('uniqueId')].tooltipMode === 'time') {
                string = date.toLocaleString();
            } else {
                string = date.getDate() + '.' + (date.getUTCMonth() + 1) + '.' + date.getUTCFullYear();
            }
            return string;
        }

        function stringToDate(str, date) {
            var dateArray = str.split('.');
            var newDate = new Date(date);
            newDate.setUTCFullYear(parseInt(dateArray[2], 10));
            newDate.setUTCMonth(parseInt((dateArray[1] - 1), 10));
            newDate.setUTCDate(parseInt(dateArray[0], 10));
            return newDate;
        }

        function adjustMultipleSlider(event) {
            event.preventDefault();
            var sliderLeft = multipleSlider.input.getBoundingClientRect().left;
            var sliderRight = multipleSlider.input.getBoundingClientRect().right;
            var posLeftHandle = sliderLeft + parseFloat(multipleSlider.fill.style.left);
            var posRightHandle = sliderRight - parseFloat(multipleSlider.fill.style.right);

            if (event.clientX > sliderLeft && (event.clientX < posLeftHandle || event.clientX < (posLeftHandle + (posRightHandle - posLeftHandle) / 2))) {
                multipleSlider.position.left = Math.round(parseFloat(event.clientX - sliderLeft) / widthStep);
            } else if (event.clientX < sliderRight && (event.clientX > posRightHandle || event.clientX > (posLeftHandle + (posRightHandle - posLeftHandle) / 2))) {
                multipleSlider.position.right = Math.round(parseFloat(event.clientX - sliderLeft) / widthStep);
            }
            moveElements(multipleSlider.position);
        }

        function moveElements(data) {
            if (typeof data === 'object') {
                if (data.left || data.left === 0) {
                    if (data.left > multipleSlider.max - 1) {
                        data.left = multipleSlider.max - 1;
                    }
                    var posLeft = data.left * widthStep;
                    multipleSlider.leftHandle.style.left = posLeft + 'px';
                    multipleSlider.fill.style.left = posLeft + 'px';
                }
                if (data.right) {
                    if (data.right < multipleSlider.min + 1) {
                        data.right = multipleSlider.min + 1;
                    }
                    var posRight = (multipleSlider.max - data.right) * widthStep;
                    multipleSlider.rightHandle.style.right = posRight + 'px';
                    multipleSlider.fill.style.right = posRight + 'px';
                }
            }
            updateParams(true, data.left, data.right);
        }

        function startEvent(event) {
            event.preventDefault();
            multipleSlider.dragObj = {};
            multipleSlider.dragObj.elNode = event.target;

            while (!multipleSlider.dragObj.elNode.classList.contains('bkgwebmap-timesliderhandle')) {
                multipleSlider.dragObj.elNode = multipleSlider.dragObj.elNode.parentNode;
            }
            // direction
            multipleSlider.dragObj.dir = multipleSlider.dragObj.elNode.classList.contains('bkgwebmap-timesliderlefthandle') ? 'left' : 'right';
            var x;
            var y;
            x = (typeof event.clientX !== 'undefined' ? event.clientX : event.touches[0].pageX) + (window.scrollX || window.pageXOffset);
            y = (typeof event.clientY !== 'undefined' ? event.clientY : event.touches[0].pageY) + (window.scrollY || window.pageYOffset);
            multipleSlider.dragObj.cursorStartX = x;
            multipleSlider.dragObj.cursorStartY = y;
            multipleSlider.dragObj.elStartLeft = parseFloat(multipleSlider.dragObj.elNode.style.left);
            multipleSlider.dragObj.elStartRight = parseFloat(multipleSlider.dragObj.elNode.style.right);
            if (isNaN(multipleSlider.dragObj.elStartLeft)) multipleSlider.dragObj.elStartLeft = 0;
            if (isNaN(multipleSlider.dragObj.elStartRight)) multipleSlider.dragObj.elStartRight = 0;
            document.addEventListener('mousemove', movingHandler, true);
            document.addEventListener('mouseup', stopHandler, true);
            document.addEventListener('touchmove', movingHandler, true);
            document.addEventListener('touchend', stopHandler, true);
        }

        function movingHandler(event) {
            event.preventDefault();
            var x = (typeof event.clientX !== 'undefined' ? event.clientX :
                event.touches[0].pageX) + (window.scrollX || window.pageXOffset);
            var calculatedVal = 0;
            if (multipleSlider.dragObj.dir === 'left') {
                calculatedVal = multipleSlider.dragObj.elStartLeft + (Math.round((x - multipleSlider.dragObj.cursorStartX) / widthStep) * widthStep);
            } else if (multipleSlider.dragObj.dir === 'right') {
                calculatedVal = multipleSlider.dragObj.elStartRight + (Math.round((multipleSlider.dragObj.cursorStartX - x) / widthStep) * widthStep);
            }
            if (calculatedVal < 0) {
                calculatedVal = 0;
            } else if (calculatedVal > widthSlider) {
                calculatedVal = widthSlider;
            }
            calculatedVal = Math.abs(calculatedVal);
            var remaining = 0;
            var handleOffset = multipleSlider.rightHandle.offsetWidth / 2;
            if (multipleSlider.dragObj.dir === 'left') {
                remaining = (widthSlider - handleOffset) - multipleSlider.fill.style.right.replace('px', '');
                if (remaining <= calculatedVal + widthStep) {
                    calculatedVal = remaining - widthStep;
                }
                multipleSlider.dragObj.elNode.style.left = calculatedVal + 'px';
                multipleSlider.fill.style.left = calculatedVal + 'px';
            } else {
                remaining = (widthSlider - handleOffset) - multipleSlider.fill.style.left.replace('px', '');
                if (remaining <= calculatedVal + widthStep) {
                    calculatedVal = remaining - widthStep;
                }

                multipleSlider.dragObj.elNode.style.right = calculatedVal + 'px';
                multipleSlider.fill.style.right = calculatedVal + 'px';
            }
            multipleSlider.position.left = Math.round(parseFloat(multipleSlider.fill.style.left) / widthStep);
            multipleSlider.position.right = Math.round((widthSlider - parseFloat(multipleSlider.fill.style.right)) / widthStep);
            updateParams(true, multipleSlider.position.left, multipleSlider.position.right);
        }

        function stopHandler(event) {
            event.preventDefault();
            document.removeEventListener('mousemove', movingHandler, true);
            document.removeEventListener('mouseup', stopHandler, true);
            document.removeEventListener('touchmove', movingHandler, true);
            document.removeEventListener('touchend', stopHandler, true);
        }

        function positioningInputsTooltip(output, input) {
            var single;
            var widthTooltip = output.offsetWidth ? output.offsetWidth : 60;
            if (!output.classList.contains('bkgwebmap-timesliderminvalue') && !output.classList.contains('bkgwebmap-timeslidermaxvalue')) {
                single = true;
            } else {
                single = false;
            }
            var newPlace;
            var newPoint;
            var wrapperWidth;
            var valuesArray = layerInfo[wmsLayer.get('uniqueId')].values;
            if (position !== undefined) {
                wrapperWidth = document.getElementById(mapDivId).getElementsByClassName('bkgwebmap-timesliderdiv')[0].offsetWidth;
            } else if (document.getElementById(target) && document.getElementById(target).getElementsByClassName('bkgwebmap-timesliderdiv').length) {
                wrapperWidth = document.getElementById(target).getElementsByClassName('bkgwebmap-timesliderdiv')[0].offsetWidth;
            } else {
                return;
            }
            if (single) {
                newPoint = parseInt((input.value), 10) / (valuesArray.length - 1);
            } else if (input.classList.contains('bkgwebmap-timesliderlefthandle')) {
                newPoint = input.style.left.replace('px', '') / widthSlider;
            } else {
                newPoint = (widthSlider - input.style.right.replace('px', '')) / widthSlider;
            }
            if (newPoint < 0) {
                newPlace = 0;
            } else if (newPoint > 1) {
                newPlace = widthSlider;
            } else {
                newPlace = widthSlider * newPoint;
            }
            if (layerInfo[wmsLayer.get('uniqueId')].tooltipMode && layerInfo[wmsLayer.get('uniqueId')].tooltipMode === 'time') {
                if (wrapperWidth > 260) {
                    output.style.left = newPlace + widthTooltip / 3 + 'px';
                } else {
                    output.style.left = newPlace + widthTooltip / 3 - 60 + 'px';
                }
            } else {
                output.style.left = newPlace + widthTooltip / 3 + 55 + 'px';
            }
        }

        function parseTimePeriod(timePeriod) {
            timePeriod = timePeriod.substr(1);
            var ymd;
            var hms;
            timePeriod = timePeriod.toLowerCase();
            if (timePeriod.indexOf('t') > -1) {
                ymd = timePeriod.substr(0, timePeriod.indexOf('t'));
                hms = timePeriod.substr(timePeriod.indexOf('t') + 1, timePeriod.length - 1);
            } else {
                ymd = timePeriod;
                hms = '';
            }

            var period = {};
            var arrayProperties = ['y', 'm', 'w', 'd', 'h', 'm', 's'];
            var arrayPeriod = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];
            var i;
            for (i = 0; i < 4; i++) {
                if (ymd.indexOf(arrayProperties[i]) > -1) {
                    period[arrayPeriod[i]] = ymd.substr(0, ymd.indexOf(arrayProperties[i]));
                    ymd = ymd.substr(ymd.indexOf(arrayProperties[i]) + 1);
                } else {
                    period[arrayPeriod[i]] = 0;
                }
            }
            for (i = 4; i < arrayProperties.length; i++) {
                if (hms.indexOf(arrayProperties[i]) > -1) {
                    period[arrayPeriod[i]] = hms.substr(0, hms.indexOf(arrayProperties[i]));
                    hms = hms.substr(hms.indexOf(arrayProperties[i]) + 1);
                } else {
                    period[arrayPeriod[i]] = 0;
                }
            }
            if (period.hours || period.minutes || period.seconds) {
                layerInfo[wmsLayer.get('uniqueId')].tooltipMode = 'time';
            } else {
                layerInfo[wmsLayer.get('uniqueId')].tooltipMode = 'days';
            }

            return period;
        }

        timeSliderButton.addEventListener('click', function () {
            var tooltips;
            var input;
            var targetElement;
            if (position !== undefined) {
                targetElement = document.getElementById(mapDivId);
            } else if (document.getElementById(target)) {
                targetElement = document.getElementById(target);
            }
            if (targetElement.getElementsByClassName('bkgwebmap-timesliderselect')[0].getElementsByTagName('option').length) {
                if (timeSliderDiv.style.display === 'none') {
                    timeSliderDiv.style.display = 'inline-block';
                    tooltips = targetElement.getElementsByClassName('bkgwebmap-timeslidervalue');
                    for (var i = 0; i < tooltips.length; i++) {
                        if (tooltips[i].classList.contains('bkgwebmap-timesliderminvalue')) {
                            input = targetElement.getElementsByClassName('bkgwebmap-timesliderlefthandle')[0];
                        } else if (tooltips[i].classList.contains('bkgwebmap-timeslidermaxvalue')) {
                            input = targetElement.getElementsByClassName('bkgwebmap-timesliderrighthandle')[0];
                        } else {
                            input = targetElement.getElementsByClassName('bkgwebmap-timesliderinput')[0];
                        }
                        positioningInputsTooltip(tooltips[i], input);
                    }
                } else {
                    timeSliderDiv.style.display = 'none';
                }
            }
        }, { passive: true });

        timeSliderButton.addEventListener('mouseenter', function () {
            var allTooltips = document.getElementsByClassName('bkgwebmap-paneltooltiptext');
            for (var i = 0; i < allTooltips.length; i++) {
                allTooltips[i].style.visibility = '';
            }
            timeSliderTooltip.style.visibility = 'visible';
            setTimeout(function () {
                timeSliderTooltip.style.visibility = '';
            }, 1200);
        }, false);

        // Finalize control
        ol.control.Control.call(this, {
            element: timeSlider,
            target: target
        });
    };
};
