var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
var seed = 100
function random() {
    var x = Math.sin(seed++) * 10000;
    return (x - Math.floor(x)).toFixed(5);
}
function roundf(f) {
  f = parseFloat(f)
  var int_f = Math.floor(f)
  return int_f + parseFloat((f - int_f).toPrecision(2))
}
function pickRandom(array) {
  return array[Math.floor(random() * array.length)]
}

function getRandomSample(range, size) {
    var arr = []
    for (var j = 0; j <= range; arr.push(j++)) {}
    var shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

function parseFormattedYAML(str) {
  let pre_replacements = [
    [/#/g, '&#35;'],
    [/<</g, '&lt;'],
    [/<code(.*)>(\r\n|\n|\r) */g, '<code$1>'],
    [/>>/g, '&gt;'],
    [/<<\\/g, '&lt;\\\\'],
    [/\$\{\{~/g, "${false_variables['"],
    [/\$\{\{/g, "${variables['"],
    [/\}\}\$/g, "']}"],
    [/\{\{/g, "variables['"],
    [/\}\}/g, "']"],
    [/~/g, "&nbsp;"],
  ];
  let post_replacements = [
   [/\|\*/g, '']
  ];
  let parsed_data = YAML.parse(replaceAll(str, pre_replacements))
  let string_data = JSON.stringify(parsed_data);
  let replaced_string_data = replaceAll(string_data, post_replacements);
  try {
    return JSON.parse(replaced_string_data)
  } catch (e) {
    console.log(e);
    console.log(replaced_string_data)
  }
}

function replaceAll(str, replacements) {
  replacements.forEach((replacement) => {
    str = str.replace(replacement[0], replacement[1]);
  })
  return str;
}

function parseQueryString(query) {
  var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    var key = decodeURIComponent(pair[0]);
    var value = decodeURIComponent(pair[1]);
    // If first entry with this name
    if (typeof query_string[key] === "undefined") {
      query_string[key] = decodeURIComponent(value);
      // If second entry with this name
    } else if (typeof query_string[key] === "string") {
      var arr = [query_string[key], decodeURIComponent(value)];
      query_string[key] = arr;
      // If third or later entry with this name
    } else {
      query_string[key].push(decodeURIComponent(value));
    }
  }
  return query_string;
}

function getProblemOfElement(obj) {
  return {
    "exercise" : $(obj).closest(".exercise_set").attr("exercise"),
    "problem" : $(obj).closest(".problem").attr("num")
  }
}

var isEqual = function (value, other) {

	// Get the value type
	var type = Object.prototype.toString.call(value);

	// If the two objects are not the same type, return false
	if (type !== Object.prototype.toString.call(other)) return false;

	// If items are not an object or array, return false
	if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

	// Compare the length of the length of the two items
	var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
	var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
	if (valueLen !== otherLen) return false;

	// Compare two items
	var compare = function (item1, item2) {

		// Get the object type
		var itemType = Object.prototype.toString.call(item1);

		// If an object or array, compare recursively
		if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
			if (!isEqual(item1, item2)) return false;
		}

		// Otherwise, do a simple comparison
		else {

			// If the two items are not the same type, return false
			if (itemType !== Object.prototype.toString.call(item2)) return false;

			// Else if it's a function, convert to a string and compare
			// Otherwise, just compare
			if (itemType === '[object Function]') {
				if (item1.toString() !== item2.toString()) return false;
			} else {
				if (item1 !== item2) return false;
			}

		}
	};

	// Compare properties
	if (type === '[object Array]') {
		for (var i = 0; i < valueLen; i++) {
			if (compare(value[i], other[i]) === false) return false;
		}
	} else {
		for (var key in value) {
			if (value.hasOwnProperty(key)) {
				if (compare(value[key], other[key]) === false) return false;
			}
		}
	}

	// If nothing failed, return true
	return true;

};

function hasMatch(list, obj) {
  for (let i = 0; i < list.length; i++) {
    obj2 = list[i];
    if (isEqual(obj, obj2)) {
      return true;
    }
  }
  return false;
}
