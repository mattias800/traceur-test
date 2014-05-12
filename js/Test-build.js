System.register("src/assert", [], function() {
  "use strict";
  var __moduleName = "src/assert";
  var POSITION_NAME = ['', '1st', '2nd', '3rd'];
  function argPositionName(i) {
    var position = (i / 2) + 1;
    return POSITION_NAME[$traceurRuntime.toProperty(position)] || (position + 'th');
  }
  var primitives = $traceurRuntime.type;
  function assertArgumentTypes() {
    for (var params = [],
        $__2 = 0; $__2 < arguments.length; $__2++)
      $traceurRuntime.setProperty(params, $__2, arguments[$traceurRuntime.toProperty($__2)]);
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
        $__3 = 0; $__3 < arguments.length; $__3++)
      $traceurRuntime.setProperty(types, $__3, arguments[$traceurRuntime.toProperty($__3)]);
    return assert.define('array of ' + types.map(prettyPrint).join('/'), function(value) {
      var $__5;
      if (assert(value).is(Array)) {
        for (var $__0 = value[$traceurRuntime.toProperty(Symbol.iterator)](),
            $__1; !($__1 = $__0.next()).done; ) {
          var item = $__1.value;
          {
            ($__5 = assert(item)).is.apply($__5, $traceurRuntime.toObject(types));
          }
        }
      }
    });
  }
  function structure(definition) {
    var properties = Object.keys(definition);
    return assert.define('object with properties ' + properties.join(', '), function(value) {
      if (assert(value).is(Object)) {
        for (var $__0 = properties[$traceurRuntime.toProperty(Symbol.iterator)](),
            $__1; !($__1 = $__0.next()).done; ) {
          var property = $__1.value;
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
        var $__5;
        for (var types = [],
            $__4 = 0; $__4 < arguments.length; $__4++)
          $traceurRuntime.setProperty(types, $__4, arguments[$traceurRuntime.toProperty($__4)]);
        var allErrors = [];
        var errors;
        for (var $__0 = types[$traceurRuntime.toProperty(Symbol.iterator)](),
            $__1; !($__1 = $__0.next()).done; ) {
          var type = $__1.value;
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
        ($__5 = currentStack).push.apply($__5, $traceurRuntime.toObject(allErrors));
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
System.register("src/Adder", [], function() {
  "use strict";
  var __moduleName = "src/Adder";
  var assert = $traceurRuntime.assertObject(System.get("src/assert")).assert;
  var Adder = function Adder() {};
  ($traceurRuntime.createClass)(Adder, {add: function(a, b) {
      assert.argumentTypes(a, $traceurRuntime.type.number, b, $traceurRuntime.type.number);
      return a + b;
    }}, {});
  Adder.prototype.add.parameters = [[$traceurRuntime.type.number], [$traceurRuntime.type.number]];
  return {get Adder() {
      return Adder;
    }};
});
System.register("src/di/util", [], function() {
  "use strict";
  var __moduleName = "src/di/util";
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
System.register("src/di/annotations", [], function() {
  "use strict";
  var __moduleName = "src/di/annotations";
  var isFunction = $traceurRuntime.assertObject(System.get("src/di/util")).isFunction;
  var SuperConstructor = function SuperConstructor() {};
  ($traceurRuntime.createClass)(SuperConstructor, {}, {});
  var TransientScope = function TransientScope() {};
  ($traceurRuntime.createClass)(TransientScope, {}, {});
  var Inject = function Inject() {
    for (var tokens = [],
        $__13 = 0; $__13 < arguments.length; $__13++)
      $traceurRuntime.setProperty(tokens, $__13, arguments[$traceurRuntime.toProperty($__13)]);
    this.tokens = tokens;
    this.isPromise = false;
    this.isLazy = false;
  };
  ($traceurRuntime.createClass)(Inject, {}, {});
  var InjectPromise = function InjectPromise() {
    for (var tokens = [],
        $__14 = 0; $__14 < arguments.length; $__14++)
      $traceurRuntime.setProperty(tokens, $__14, arguments[$traceurRuntime.toProperty($__14)]);
    this.tokens = tokens;
    this.isPromise = true;
    this.isLazy = false;
  };
  ($traceurRuntime.createClass)(InjectPromise, {}, {}, Inject);
  var InjectLazy = function InjectLazy() {
    for (var tokens = [],
        $__15 = 0; $__15 < arguments.length; $__15++)
      $traceurRuntime.setProperty(tokens, $__15, arguments[$traceurRuntime.toProperty($__15)]);
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
    for (var $__9 = fn.annotations[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__10; !($__10 = $__9.next()).done; ) {
      var annotation = $__10.value;
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
      for (var $__9 = fn.annotations[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__10; !($__10 = $__9.next()).done; ) {
        var annotation = $__10.value;
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
        for (var $__11 = param[$traceurRuntime.toProperty(Symbol.iterator)](),
            $__12; !($__12 = $__11.next()).done; ) {
          var paramAnnotation = $__12.value;
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
System.register("src/di/profiler", [], function() {
  "use strict";
  var __moduleName = "src/di/profiler";
  var toString = $traceurRuntime.assertObject(System.get("src/di/util")).toString;
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
System.register("src/di/providers", [], function() {
  "use strict";
  var __moduleName = "src/di/providers";
  var $__21 = $traceurRuntime.assertObject(System.get("src/di/annotations")),
      SuperConstructorAnnotation = $__21.SuperConstructor,
      readAnnotations = $__21.readAnnotations;
  var $__21 = $traceurRuntime.assertObject(System.get("src/di/util")),
      isClass = $__21.isClass,
      isFunction = $__21.isFunction,
      isObject = $__21.isObject,
      toString = $__21.toString;
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
      for (var $__19 = params[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__20; !($__20 = $__19.next()).done; ) {
        var param = $__20.value;
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
    for (var $__19 = params[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__20; !($__20 = $__19.next()).done; ) {
      var param = $__20.value;
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
System.register("src/di/injector", [], function() {
  "use strict";
  var __moduleName = "src/di/injector";
  var $__26 = $traceurRuntime.assertObject(System.get("src/di/annotations")),
      annotate = $__26.annotate,
      readAnnotations = $__26.readAnnotations,
      hasAnnotation = $__26.hasAnnotation,
      ProvideAnnotation = $__26.Provide,
      TransientScopeAnnotation = $__26.TransientScope;
  var $__26 = $traceurRuntime.assertObject(System.get("src/di/util")),
      isFunction = $__26.isFunction,
      toString = $__26.toString;
  var profileInjector = $traceurRuntime.assertObject(System.get("src/di/profiler")).profileInjector;
  var createProviderFromFnOrClass = $traceurRuntime.assertObject(System.get("src/di/providers")).createProviderFromFnOrClass;
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
      for (var $__24 = modules[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__25; !($__25 = $__24.next()).done; ) {
        var module = $__25.value;
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
      var $__22 = this;
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
          return $__22.get(param.token, resolving, true, param.isLazy);
        }
        return $__22.get(param.token, resolving, param.isPromise, param.isLazy);
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
      for (var $__24 = forceNewInstancesOf[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__25; !($__25 = $__24.next()).done; ) {
        var annotation = $__25.value;
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
System.register("test/AdderSpec", [], function() {
  "use strict";
  var __moduleName = "test/AdderSpec";
  var Injector = $traceurRuntime.assertObject(System.get("src/di/injector")).Injector;
  var Adder = $traceurRuntime.assertObject(System.get("src/Adder")).Adder;
  describe("Adder", function() {
    var injector = new Injector();
    var adder = injector.get(Adder);
    it("should work", function() {
      expect(true).toBeTruthy();
    });
    it("should add", function() {
      expect(adder.add(1, 2)).toBe(3);
    });
  });
  return {};
});
System.get("test/AdderSpec" + '');

//# sourceMappingURL=Test-build.map
