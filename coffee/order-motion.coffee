class OrderMotion
  constructor: (options)->
    @options =
      'attr': 'data-order'
      '$el': $('html')
      'interval': 100
      'autoStart': true
      'motion': @addClass
      'reverse': @removeClass
      'cls': 'is-active'
      'beforeFn': ->
      'afterFn': ->
    $.extend(@options, options)
    @$el = @options.$el.find('['+@options.attr+']')
    @attr = @options.attr
    @interval = @options.interval
    @maxOrder = 0
    @cls = @options.cls
    @init()

  init:->
    if @options.custom
      for key, fn of @options.custom
        @[key] = fn unless @[key]

    @setElems()
    @start() if @options.autoStart

  setElems:->
    @elems = []
    @$el.each (i, el)=>
      $el = $(el)
      attr = $el.attr @attr

      order = 0
      motionFn = @options.motion
      motionParam = @options.cls
      reverseFn = null
      reverseParam = @options.cls

      if attr.indexOf('|') != -1
        attr = attr.split('|')[0]
        reverseFn = if attr.split('|')[1] then attr.split('|')[1] else @options.reverse

      if attr
        $.each attr.split(','), (i, opt)=>
          if Number(opt).toString() != 'NaN'
            order = Number(opt)
            @maxOrder = order if order > @maxOrder
          else
            motionStr = opt
            if motionStr.indexOf(':') != -1
              motionFn = @[motionStr.split(':')[0]] if @[motionStr.split(':')[0]]
              motionParam = motionStr.split(':')[1]
            else
              if @[motionStr]
                motionFn = @[motionStr]
              else
                motionParam = motionStr

      @elems.push
        '$el' : $el
        'order': order
        'motion':
          'func': motionFn
          'param': motionParam
        'reverse':
          'func': reverseFn
          'param': reverseParam


  start:->
    $.each @elems, (i, elem)=>
      setTimeout =>
        @doMotion elem.$el, elem.motion
      , @interval * elem.order

  reverse:->
    $.each @elems, (i, elem)=>
      setTimeout =>
        @doMotion elem.$el, elem.motion
      , @interval * (@elems.length - elem.order)


  doMotion: ($el, motion)->
    if typeof motion == 'function'
      motion($el)
    else if motion.func
      motion.func($el, motion.param)


  addClass: ($el, param)->
    $el.addClass param

  removeClass: ($el, param)->
    $el.removeClass param

