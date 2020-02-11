var api = {
  getClassDates: function(callback) {
    callback.call(null, {
      active: [],
      open: ["20190826", "20190827", "20190828", "20190829", "20190830", 
      "20190902", "20190903", "20190904", "20190905", "20190906",
      "20190909", "20190910", "20190911", "20190912", "20190913",
    ]
    });
  },
  getLocation: function() {
    return "TBD Location."
  }
}
