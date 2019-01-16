/**
 * Common functions for running examples.
 * <br/>
 *
 * Created by thalheim on 08.08.2018.
 *
 * @author <a href="dirk.thalheim@bkg.bund.de">Dirk Thalheim</a>
 * @version $ - $
 */

function getUrlParameter(key, defaultValue) {
    var url = new URL(window.location);
    var srsname = url.searchParams.get(key);
    return srsname || defaultValue;
};
