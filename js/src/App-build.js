System.register("di/util", [], function() {
  "use strict";
  var __moduleName = "di/util";
  function isUpperCase(char) {
    return char.toUpperCase() === char;
  }
  function isClass(clsOrFunction) {
    if (clsOrFunction.name) {
      return isUpperCase(clsOrFunction.name.charAt(0));
    }
    return Object.keys(clsOrFunction.prototype).length > 0;
  }
  function isFunction(value) {
    return typeof value === 'function';
  }
  function isObject(value) {
    return (typeof value === 'undefined' ? 'undefined' : $traceurRuntime.typeof(value)) === 'object';
  }
  function toString(token) {
    if (typeof token === 'string') {
      return token;
    }
    if (token === undefined || token === null) {
      return '' + token;
    }
    if (token.name) {
      return token.name;
    }
    return token.toString();
  }
  ;
  return {
    get isUpperCase() {
      return isUpperCase;
    },
    get isClass() {
      return isClass;
    },
    get isFunction() {
      return isFunction;
    },
    get isObject() {
      return isObject;
    },
    get toString() {
      return toString;
    }
  };
});
System.register("di/annotations", [], function() {
  "use strict";
  var __moduleName = "di/annotations";
  var isFunction = $traceurRuntime.assertObject(System.get("di/util")).isFunction;
  var SuperConstructor = function SuperConstructor() {};
  ($traceurRuntime.createClass)(SuperConstructor, {}, {});
  var TransientScope = function TransientScope() {};
  ($traceurRuntime.createClass)(TransientScope, {}, {});
  var Inject = function Inject() {
    for (var tokens = [],
        $__5 = 0; $__5 < arguments.length; $__5++)
      $traceurRuntime.setProperty(tokens, $__5, arguments[$traceurRuntime.toProperty($__5)]);
    this.tokens = tokens;
    this.isPromise = false;
    this.isLazy = false;
  };
  ($traceurRuntime.createClass)(Inject, {}, {});
  var InjectPromise = function InjectPromise() {
    for (var tokens = [],
        $__6 = 0; $__6 < arguments.length; $__6++)
      $traceurRuntime.setProperty(tokens, $__6, arguments[$traceurRuntime.toProperty($__6)]);
    this.tokens = tokens;
    this.isPromise = true;
    this.isLazy = false;
  };
  ($traceurRuntime.createClass)(InjectPromise, {}, {}, Inject);
  var InjectLazy = function InjectLazy() {
    for (var tokens = [],
        $__7 = 0; $__7 < arguments.length; $__7++)
      $traceurRuntime.setProperty(tokens, $__7, arguments[$traceurRuntime.toProperty($__7)]);
    this.tokens = tokens;
    this.isPromise = false;
    this.isLazy = true;
  };
  ($traceurRuntime.createClass)(InjectLazy, {}, {}, Inject);
  var Provide = function Provide(token) {
    this.token = token;
    this.isPromise = false;
  };
  ($traceurRuntime.createClass)(Provide, {}, {});
  var ProvidePromise = function ProvidePromise(token) {
    this.token = token;
    this.isPromise = true;
  };
  ($traceurRuntime.createClass)(ProvidePromise, {}, {}, Provide);
  function annotate(fn, annotation) {
    fn.annotations = fn.annotations || [];
    fn.annotations.push(annotation);
  }
  function hasAnnotation(fn, annotationClass) {
    if (!fn.annotations || fn.annotations.length === 0) {
      return false;
    }
    for (var $__1 = fn.annotations[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__2; !($__2 = $__1.next()).done; ) {
      var annotation = $__2.value;
      {
        if (annotation instanceof annotationClass) {
          return true;
        }
      }
    }
    return false;
  }
  function readAnnotations(fn) {
    var collectedAnnotations = {
      provide: {
        token: null,
        isPromise: false
      },
      params: []
    };
    if (fn.annotations && fn.annotations.length) {
      for (var $__1 = fn.annotations[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__2; !($__2 = $__1.next()).done; ) {
        var annotation = $__2.value;
        {
          if (annotation instanceof Inject) {
            collectedAnnotations.params = annotation.tokens.map((function(token) {
              return {
                token: token,
                isPromise: annotation.isPromise,
                isLazy: annotation.isLazy
              };
            }));
          }
          if (annotation instanceof Provide) {
            collectedAnnotations.provide.token = annotation.token;
            collectedAnnotations.provide.isPromise = annotation.isPromise;
          }
        }
      }
    }
    if (fn.parameters) {
      fn.parameters.forEach((function(param, idx) {
        for (var $__3 = param[$traceurRuntime.toProperty(Symbol.iterator)](),
            $__4; !($__4 = $__3.next()).done; ) {
          var paramAnnotation = $__4.value;
          {
            if (isFunction(paramAnnotation) && !collectedAnnotations.params[$traceurRuntime.toProperty(idx)]) {
              $traceurRuntime.setProperty(collectedAnnotations.params, idx, {
                token: paramAnnotation,
                isPromise: false,
                isLazy: false
              });
            } else if (paramAnnotation instanceof Inject) {
              $traceurRuntime.setProperty(collectedAnnotations.params, idx, {
                token: paramAnnotation.tokens[0],
                isPromise: paramAnnotation.isPromise,
                isLazy: paramAnnotation.isLazy
              });
            }
          }
        }
      }));
    }
    return collectedAnnotations;
  }
  ;
  return {
    get annotate() {
      return annotate;
    },
    get hasAnnotation() {
      return hasAnnotation;
    },
    get readAnnotations() {
      return readAnnotations;
    },
    get SuperConstructor() {
      return SuperConstructor;
    },
    get TransientScope() {
      return TransientScope;
    },
    get Inject() {
      return Inject;
    },
    get InjectPromise() {
      return InjectPromise;
    },
    get InjectLazy() {
      return InjectLazy;
    },
    get Provide() {
      return Provide;
    },
    get ProvidePromise() {
      return ProvidePromise;
    }
  };
});
System.register("di/profiler", [], function() {
  "use strict";
  var __moduleName = "di/profiler";
  var toString = $traceurRuntime.assertObject(System.get("di/util")).toString;
  var IS_DEBUG = false;
  var _global = null;
  if ((typeof process === 'undefined' ? 'undefined' : $traceurRuntime.typeof(process)) === 'object' && process.env) {
    IS_DEBUG = !!process.env[$traceurRuntime.toProperty('DEBUG')];
    _global = global;
  } else if ((typeof location === 'undefined' ? 'undefined' : $traceurRuntime.typeof(location)) === 'object' && location.search) {
    IS_DEBUG = /di_debug/.test(location.search);
    _global = window;
  }
  var globalCounter = 0;
  function getUniqueId() {
    return ++globalCounter;
  }
  function serializeToken(token, tokens) {
    if (!tokens.has(token)) {
      tokens.set(token, getUniqueId().toString());
    }
    return tokens.get(token);
  }
  function serializeProvider(provider, key, tokens) {
    return {
      id: serializeToken(key, tokens),
      name: toString(key),
      isPromise: provider.isPromise,
      dependencies: provider.params.map(function(param) {
        return {
          token: serializeToken(param.token, tokens),
          isPromise: param.isPromise,
          isLazy: param.isLazy
        };
      })
    };
  }
  function serializeInjector(injector, tokens, Injector) {
    var serializedInjector = {
      id: serializeToken(injector, tokens),
      parent_id: injector.parent ? serializeToken(injector.parent, tokens) : null,
      providers: {}
    };
    var injectorClassId = serializeToken(Injector, tokens);
    $traceurRuntime.setProperty(serializedInjector.providers, injectorClassId, {
      id: injectorClassId,
      name: toString(Injector),
      isPromise: false,
      dependencies: []
    });
    injector.providers.forEach(function(provider, key) {
      var serializedProvider = serializeProvider(provider, key, tokens);
      $traceurRuntime.setProperty(serializedInjector.providers, serializedProvider.id, serializedProvider);
    });
    return serializedInjector;
  }
  function profileInjector(injector, Injector) {
    if (!IS_DEBUG) {
      return;
    }
    if (!_global.__di_dump__) {
      _global.__di_dump__ = {
        injectors: [],
        tokens: new Map()
      };
    }
    _global.__di_dump__.injectors.push(serializeInjector(injector, _global.__di_dump__.tokens, Injector));
  }
  return {get profileInjector() {
      return profileInjector;
    }};
});
System.register("di/providers", [], function() {
  "use strict";
  var __moduleName = "di/providers";
  var $__13 = $traceurRuntime.assertObject(System.get("di/annotations")),
      SuperConstructorAnnotation = $__13.SuperConstructor,
      readAnnotations = $__13.readAnnotations;
  var $__13 = $traceurRuntime.assertObject(System.get("di/util")),
      isClass = $__13.isClass,
      isFunction = $__13.isFunction,
      isObject = $__13.isObject,
      toString = $__13.toString;
  var EmptyFunction = Object.getPrototypeOf(Function);
  var ClassProvider = function ClassProvider(clazz, params, isPromise) {
    this.provider = clazz;
    this.isPromise = isPromise;
    this.params = [];
    this.constructors = [];
    this._flattenParams(clazz, params);
    this.constructors.unshift([clazz, 0, this.params.length - 1]);
  };
  ($traceurRuntime.createClass)(ClassProvider, {
    _flattenParams: function(constructor, params) {
      var SuperConstructor;
      var constructorInfo;
      for (var $__11 = params[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__12; !($__12 = $__11.next()).done; ) {
        var param = $__12.value;
        {
          if (param.token === SuperConstructorAnnotation) {
            SuperConstructor = Object.getPrototypeOf(constructor);
            if (SuperConstructor === EmptyFunction) {
              throw new Error((toString(constructor) + " does not have a parent constructor. Only classes with a parent can ask for SuperConstructor!"));
            }
            constructorInfo = [SuperConstructor, this.params.length];
            this.constructors.push(constructorInfo);
            this._flattenParams(SuperConstructor, readAnnotations(SuperConstructor).params);
            constructorInfo.push(this.params.length - 1);
          } else {
            this.params.push(param);
          }
        }
      }
    },
    _createConstructor: function(currentConstructorIdx, context, allArguments) {
      var constructorInfo = this.constructors[$traceurRuntime.toProperty(currentConstructorIdx)];
      var nextConstructorInfo = this.constructors[$traceurRuntime.toProperty(currentConstructorIdx + 1)];
      var argsForCurrentConstructor;
      if (nextConstructorInfo) {
        argsForCurrentConstructor = allArguments.slice(constructorInfo[1], nextConstructorInfo[1]).concat([this._createConstructor(currentConstructorIdx + 1, context, allArguments)]).concat(allArguments.slice(nextConstructorInfo[2] + 1, constructorInfo[2] + 1));
      } else {
        argsForCurrentConstructor = allArguments.slice(constructorInfo[1], constructorInfo[2] + 1);
      }
      return function InjectedAndBoundSuperConstructor() {
        return constructorInfo[0].apply(context, argsForCurrentConstructor);
      };
    },
    create: function(args) {
      var context = Object.create(this.provider.prototype);
      var constructor = this._createConstructor(0, context, args);
      var returnedValue = constructor();
      if (isFunction(returnedValue) || isObject(returnedValue)) {
        return returnedValue;
      }
      return context;
    }
  }, {});
  var FactoryProvider = function FactoryProvider(factoryFunction, params, isPromise) {
    this.provider = factoryFunction;
    this.params = params;
    this.isPromise = isPromise;
    for (var $__11 = params[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__12; !($__12 = $__11.next()).done; ) {
      var param = $__12.value;
      {
        if (param.token === SuperConstructorAnnotation) {
          throw new Error((toString(factoryFunction) + " is not a class. Only classes with a parent can ask for SuperConstructor!"));
        }
      }
    }
  };
  ($traceurRuntime.createClass)(FactoryProvider, {create: function(args) {
      return this.provider.apply(undefined, args);
    }}, {});
  function createProviderFromFnOrClass(fnOrClass, annotations) {
    if (isClass(fnOrClass)) {
      return new ClassProvider(fnOrClass, annotations.params, annotations.provide.isPromise);
    }
    return new FactoryProvider(fnOrClass, annotations.params, annotations.provide.isPromise);
  }
  return {get createProviderFromFnOrClass() {
      return createProviderFromFnOrClass;
    }};
});
System.register("di/injector", [], function() {
  "use strict";
  var __moduleName = "di/injector";
  var $__18 = $traceurRuntime.assertObject(System.get("di/annotations")),
      annotate = $__18.annotate,
      readAnnotations = $__18.readAnnotations,
      hasAnnotation = $__18.hasAnnotation,
      ProvideAnnotation = $__18.Provide,
      TransientScopeAnnotation = $__18.TransientScope;
  var $__18 = $traceurRuntime.assertObject(System.get("di/util")),
      isFunction = $__18.isFunction,
      toString = $__18.toString;
  var profileInjector = $traceurRuntime.assertObject(System.get("di/profiler")).profileInjector;
  var createProviderFromFnOrClass = $traceurRuntime.assertObject(System.get("di/providers")).createProviderFromFnOrClass;
  function constructResolvingMessage(resolving, token) {
    if (arguments.length > 1) {
      resolving.push(token);
    }
    if (resolving.length > 1) {
      return (" (" + resolving.map(toString).join(' -> ') + ")");
    }
    return '';
  }
  var Injector = function Injector() {
    var modules = arguments[0] !== (void 0) ? arguments[0] : [];
    var parentInjector = arguments[1] !== (void 0) ? arguments[1] : null;
    var providers = arguments[2] !== (void 0) ? arguments[2] : new Map();
    this.cache = new Map();
    this.providers = providers;
    this.parent = parentInjector;
    this._loadModules(modules);
    profileInjector(this, $Injector);
  };
  var $Injector = Injector;
  ($traceurRuntime.createClass)(Injector, {
    _collectProvidersWithAnnotation: function(annotationClass, collectedProviders) {
      this.providers.forEach((function(provider, token) {
        if (!collectedProviders.has(token) && hasAnnotation(provider.provider, annotationClass)) {
          collectedProviders.set(token, provider);
        }
      }));
      if (this.parent) {
        this.parent._collectProvidersWithAnnotation(annotationClass, collectedProviders);
      }
    },
    _loadModules: function(modules) {
      for (var $__16 = modules[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__17; !($__17 = $__16.next()).done; ) {
        var module = $__17.value;
        {
          if (isFunction(module)) {
            this._loadFnOrClass(module);
            continue;
          }
          throw new Error('Invalid module!');
        }
      }
    },
    _loadFnOrClass: function(fnOrClass) {
      var annotations = readAnnotations(fnOrClass);
      var token = annotations.provide.token || fnOrClass;
      var provider = createProviderFromFnOrClass(fnOrClass, annotations);
      this.providers.set(token, provider);
    },
    _hasProviderFor: function(token) {
      if (this.providers.has(token)) {
        return true;
      }
      if (this.parent) {
        return this.parent._hasProviderFor(token);
      }
      return false;
    },
    get: function(token) {
      var resolving = arguments[1] !== (void 0) ? arguments[1] : [];
      var wantPromise = arguments[2] !== (void 0) ? arguments[2] : false;
      var wantLazy = arguments[3] !== (void 0) ? arguments[3] : false;
      var $__14 = this;
      var resolvingMsg = '';
      var instance;
      var injector = this;
      if (token === null || token === undefined) {
        resolvingMsg = constructResolvingMessage(resolving, token);
        throw new Error(("Invalid token \"" + token + "\" requested!" + resolvingMsg));
      }
      if (token === $Injector) {
        if (wantPromise) {
          return Promise.resolve(this);
        }
        return this;
      }
      if (wantLazy) {
        return function createLazyInstance() {
          var lazyInjector = injector;
          if (arguments.length) {
            var locals = [];
            var args = arguments;
            for (var i = 0; i < args.length; i += 2) {
              locals.push((function(ii) {
                var fn = function createLocalInstance() {
                  return args[$traceurRuntime.toProperty(ii + 1)];
                };
                annotate(fn, new ProvideAnnotation(args[$traceurRuntime.toProperty(ii)]));
                return fn;
              })(i));
            }
            lazyInjector = injector.createChild(locals);
          }
          return lazyInjector.get(token, resolving, wantPromise, false);
        };
      }
      if (this.cache.has(token)) {
        instance = this.cache.get(token);
        if (this.providers.get(token).isPromise) {
          if (!wantPromise) {
            resolvingMsg = constructResolvingMessage(resolving, token);
            throw new Error(("Cannot instantiate " + toString(token) + " synchronously. It is provided as a promise!" + resolvingMsg));
          }
        } else {
          if (wantPromise) {
            return Promise.resolve(instance);
          }
        }
        return instance;
      }
      var provider = this.providers.get(token);
      if (!provider && isFunction(token) && !this._hasProviderFor(token)) {
        provider = createProviderFromFnOrClass(token, readAnnotations(token));
        this.providers.set(token, provider);
      }
      if (!provider) {
        if (!this.parent) {
          resolvingMsg = constructResolvingMessage(resolving, token);
          throw new Error(("No provider for " + toString(token) + "!" + resolvingMsg));
        }
        return this.parent.get(token, resolving, wantPromise, wantLazy);
      }
      if (resolving.indexOf(token) !== -1) {
        resolvingMsg = constructResolvingMessage(resolving, token);
        throw new Error(("Cannot instantiate cyclic dependency!" + resolvingMsg));
      }
      resolving.push(token);
      var delayingInstantiation = wantPromise && provider.params.some((function(param) {
        return !param.isPromise;
      }));
      var args = provider.params.map((function(param) {
        if (delayingInstantiation) {
          return $__14.get(param.token, resolving, true, param.isLazy);
        }
        return $__14.get(param.token, resolving, param.isPromise, param.isLazy);
      }));
      if (delayingInstantiation) {
        var delayedResolving = resolving.slice();
        resolving.pop();
        return Promise.all(args).then(function(args) {
          try {
            instance = provider.create(args);
          } catch (e) {
            resolvingMsg = constructResolvingMessage(delayedResolving);
            var originalMsg = 'ORIGINAL ERROR: ' + e.message;
            e.message = ("Error during instantiation of " + toString(token) + "!" + resolvingMsg + "\n" + originalMsg);
            throw e;
          }
          if (!hasAnnotation(provider.provider, TransientScopeAnnotation)) {
            injector.cache.set(token, instance);
          }
          return instance;
        });
      }
      try {
        instance = provider.create(args);
      } catch (e) {
        resolvingMsg = constructResolvingMessage(resolving);
        var originalMsg = 'ORIGINAL ERROR: ' + e.message;
        e.message = ("Error during instantiation of " + toString(token) + "!" + resolvingMsg + "\n" + originalMsg);
        throw e;
      }
      if (!hasAnnotation(provider.provider, TransientScopeAnnotation)) {
        this.cache.set(token, instance);
      }
      if (!wantPromise && provider.isPromise) {
        resolvingMsg = constructResolvingMessage(resolving);
        throw new Error(("Cannot instantiate " + toString(token) + " synchronously. It is provided as a promise!" + resolvingMsg));
      }
      if (wantPromise && !provider.isPromise) {
        instance = Promise.resolve(instance);
      }
      resolving.pop();
      return instance;
    },
    getPromise: function(token) {
      return this.get(token, [], true);
    },
    createChild: function() {
      var modules = arguments[0] !== (void 0) ? arguments[0] : [];
      var forceNewInstancesOf = arguments[1] !== (void 0) ? arguments[1] : [];
      var forcedProviders = new Map();
      for (var $__16 = forceNewInstancesOf[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__17; !($__17 = $__16.next()).done; ) {
        var annotation = $__17.value;
        {
          this._collectProvidersWithAnnotation(annotation, forcedProviders);
        }
      }
      return new $Injector(modules, this, forcedProviders);
    }
  }, {});
  ;
  return {get Injector() {
      return Injector;
    }};
});
System.register("di/index", [], function() {
  "use strict";
  var __moduleName = "di/index";
  var $__di_47_injector__ = System.get("di/injector");
  var $__di_47_annotations__ = System.get("di/annotations");
  return {
    get Injector() {
      return $__di_47_injector__.Injector;
    },
    get annotate() {
      return $__di_47_annotations__.annotate;
    },
    get Inject() {
      return $__di_47_annotations__.Inject;
    },
    get InjectLazy() {
      return $__di_47_annotations__.InjectLazy;
    },
    get InjectPromise() {
      return $__di_47_annotations__.InjectPromise;
    },
    get Provide() {
      return $__di_47_annotations__.Provide;
    },
    get ProvidePromise() {
      return $__di_47_annotations__.ProvidePromise;
    },
    get SuperConstructor() {
      return $__di_47_annotations__.SuperConstructor;
    },
    get TransientScope() {
      return $__di_47_annotations__.TransientScope;
    }
  };
});
System.register("assert", [], function() {
  "use strict";
  var __moduleName = "assert";
  var POSITION_NAME = ['', '1st', '2nd', '3rd'];
  function argPositionName(i) {
    var position = (i / 2) + 1;
    return POSITION_NAME[$traceurRuntime.toProperty(position)] || (position + 'th');
  }
  var primitives = $traceurRuntime.type;
  function assertArgumentTypes() {
    for (var params = [],
        $__21 = 0; $__21 < arguments.length; $__21++)
      $traceurRuntime.setProperty(params, $__21, arguments[$traceurRuntime.toProperty($__21)]);
    var actual,
        type;
    var currentArgErrors;
    var errors = [];
    var msg;
    for (var i = 0,
        l = params.length; i < l; i = i + 2) {
      actual = params[$traceurRuntime.toProperty(i)];
      type = params[$traceurRuntime.toProperty(i + 1)];
      currentArgErrors = [];
      if (!isType(actual, type, currentArgErrors)) {
        errors.push(argPositionName(i) + ' argument has to be an instance of ' + prettyPrint(type) + ', got ' + prettyPrint(actual));
        if (currentArgErrors.length) {
          errors.push(currentArgErrors);
        }
      }
    }
    if (errors.length) {
      throw new Error('Invalid arguments given!\n' + formatErrors(errors));
    }
  }
  function prettyPrint(value) {
    if (typeof value === 'undefined') {
      return 'undefined';
    }
    if (typeof value === 'string') {
      return '"' + value + '"';
    }
    if (typeof value === 'boolean') {
      return value.toString();
    }
    if (value === null) {
      return 'null';
    }
    if ((typeof value === 'undefined' ? 'undefined' : $traceurRuntime.typeof(value)) === 'object') {
      if (value.map) {
        return '[' + value.map(prettyPrint).join(', ') + ']';
      }
      var properties = Object.keys(value);
      return '{' + properties.map((function(p) {
        return p + ': ' + prettyPrint(value[$traceurRuntime.toProperty(p)]);
      })).join(', ') + '}';
    }
    return value.__assertName || value.name || value.toString();
  }
  function isType(value, T, errors) {
    if (T === primitives.void) {
      return typeof value === 'undefined';
    }
    if (T === primitives.any || value === null) {
      return true;
    }
    if (T === primitives.string) {
      return typeof value === 'string';
    }
    if (T === primitives.number) {
      return typeof value === 'number';
    }
    if (T === primitives.boolean) {
      return typeof value === 'boolean';
    }
    if (typeof T.assert === 'function') {
      var parentStack = currentStack;
      var isValid;
      currentStack = errors;
      try {
        isValid = T.assert(value);
      } catch (e) {
        fail(e.message);
        isValid = false;
      }
      currentStack = parentStack;
      if (typeof isValid === 'undefined') {
        isValid = errors.length === 0;
      }
      return isValid;
    }
    return value instanceof T;
  }
  function formatErrors(errors) {
    var indent = arguments[1] !== (void 0) ? arguments[1] : '  ';
    return errors.map((function(e) {
      if (typeof e === 'string')
        return indent + '- ' + e;
      return formatErrors(e, indent + '  ');
    })).join('\n');
  }
  function type(actual, T) {
    var errors = [];
    if (!isType(actual, T, errors)) {
      var msg = 'Expected an instance of ' + prettyPrint(T) + ', got ' + prettyPrint(actual) + '!';
      if (errors.length) {
        msg += '\n' + formatErrors(errors);
      }
      throw new Error(msg);
    }
  }
  function returnType(actual, T) {
    var errors = [];
    if (!isType(actual, T, errors)) {
      var msg = 'Expected to return an instance of ' + prettyPrint(T) + ', got ' + prettyPrint(actual) + '!';
      if (errors.length) {
        msg += '\n' + formatErrors(errors);
      }
      throw new Error(msg);
    }
    return actual;
  }
  var string = define('string', function(value) {
    return typeof value === 'string';
  });
  var boolean = define('boolean', function(value) {
    return typeof value === 'boolean';
  });
  var number = define('number', function(value) {
    return typeof value === 'number';
  });
  function arrayOf() {
    for (var types = [],
        $__22 = 0; $__22 < arguments.length; $__22++)
      $traceurRuntime.setProperty(types, $__22, arguments[$traceurRuntime.toProperty($__22)]);
    return assert.define('array of ' + types.map(prettyPrint).join('/'), function(value) {
      var $__24;
      if (assert(value).is(Array)) {
        for (var $__19 = value[$traceurRuntime.toProperty(Symbol.iterator)](),
            $__20; !($__20 = $__19.next()).done; ) {
          var item = $__20.value;
          {
            ($__24 = assert(item)).is.apply($__24, $traceurRuntime.toObject(types));
          }
        }
      }
    });
  }
  function structure(definition) {
    var properties = Object.keys(definition);
    return assert.define('object with properties ' + properties.join(', '), function(value) {
      if (assert(value).is(Object)) {
        for (var $__19 = properties[$traceurRuntime.toProperty(Symbol.iterator)](),
            $__20; !($__20 = $__19.next()).done; ) {
          var property = $__20.value;
          {
            assert(value[$traceurRuntime.toProperty(property)]).is(definition[$traceurRuntime.toProperty(property)]);
          }
        }
      }
    });
  }
  var currentStack = [];
  function fail(message) {
    currentStack.push(message);
  }
  function define(classOrName, check) {
    var cls = classOrName;
    if (typeof classOrName === 'string') {
      cls = function() {};
      cls.__assertName = classOrName;
    }
    cls.assert = function(value) {
      return check(value);
    };
    return cls;
  }
  function assert(value) {
    return {is: function is() {
        var $__24;
        for (var types = [],
            $__23 = 0; $__23 < arguments.length; $__23++)
          $traceurRuntime.setProperty(types, $__23, arguments[$traceurRuntime.toProperty($__23)]);
        var allErrors = [];
        var errors;
        for (var $__19 = types[$traceurRuntime.toProperty(Symbol.iterator)](),
            $__20; !($__20 = $__19.next()).done; ) {
          var type = $__20.value;
          {
            errors = [];
            if (isType(value, type, errors)) {
              return true;
            }
            allErrors.push(prettyPrint(value) + ' is not instance of ' + prettyPrint(type));
            if (errors.length) {
              allErrors.push(errors);
            }
          }
        }
        ($__24 = currentStack).push.apply($__24, $traceurRuntime.toObject(allErrors));
        return false;
      }};
  }
  assert.type = type;
  assert.argumentTypes = assertArgumentTypes;
  assert.returnType = returnType;
  assert.define = define;
  assert.fail = fail;
  assert.string = string;
  assert.number = number;
  assert.boolean = boolean;
  assert.arrayOf = arrayOf;
  assert.structure = structure;
  ;
  return {get assert() {
      return assert;
    }};
});
System.register("greeter/NameFormatter", [], function() {
  "use strict";
  var __moduleName = "greeter/NameFormatter";
  var assert = $traceurRuntime.assertObject(System.get("assert")).assert;
  var NameFormatter = function NameFormatter() {};
  ($traceurRuntime.createClass)(NameFormatter, {format: function(name) {
      assert.argumentTypes(name, $traceurRuntime.type.string);
      return name.toUpperCase();
    }}, {});
  NameFormatter.prototype.format.parameters = [[$traceurRuntime.type.string]];
  return {get NameFormatter() {
      return NameFormatter;
    }};
});
System.register("greeter/Greeter", [], function() {
  "use strict";
  var __moduleName = "greeter/Greeter";
  var assert = $traceurRuntime.assertObject(System.get("assert")).assert;
  var Inject = $traceurRuntime.assertObject(System.get("di/index")).Inject;
  var NameFormatter = $traceurRuntime.assertObject(System.get("greeter/NameFormatter")).NameFormatter;
  var Greeter = function Greeter(formatter) {
    assert.argumentTypes(formatter, NameFormatter);
    this.formatter = formatter;
  };
  ($traceurRuntime.createClass)(Greeter, {sayHi: function() {
      var name = arguments[0] !== (void 0) ? arguments[0] : "Anonymous";
      assert.argumentTypes(name, $traceurRuntime.type.string);
      console.log("Hello " + this.formatter.format(name));
    }}, {});
  Greeter.annotations = [new Inject(NameFormatter)];
  Greeter.parameters = [[NameFormatter]];
  Greeter.prototype.sayHi.parameters = [[$traceurRuntime.type.string]];
  return {get Greeter() {
      return Greeter;
    }};
});
System.register("App", [], function() {
  "use strict";
  var __moduleName = "App";
  var assert = $traceurRuntime.assertObject(System.get("assert")).assert;
  var Injector = $traceurRuntime.assertObject(System.get("di/injector")).Injector;
  var Greeter = $traceurRuntime.assertObject(System.get("greeter/Greeter")).Greeter;
  console.log("Creating greeter..");
  var injector = new Injector();
  var greeter = injector.get(Greeter);
  function say(greeterss) {
    assert.argumentTypes(greeterss, Greeter);
    greeterss.sayHi("Mattias");
  }
  say.parameters = [[Greeter]];
  say(greeter);
  return {};
});
System.get("App" + '');

//# sourceMappingURL=App-build.map
