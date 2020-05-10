/**
 * @scope enchant.Tween.prototype
 */
enchant.Tween = enchant.Class.create(enchant.Action, {
    __classname__: 'enchant.Tween',
    /**
     * @name enchant.Tween
     * @class
     [lang:ja]
     * オブジェクトの特定のプロパティを, なめらかに変更したい時に用いるためのアクションクラス.
     * アクションを扱いやすく拡張したクラス.
     *
     * コンストラクタに渡す設定オブジェクトに, プロパティの目標値を指定すると,
     * アクションが実行された時に, 目標値までなめらかに値を変更するようなアクションを生成する.
     *
     * トゥイーンのイージングも, easing プロパティで指定できる.
     *
     * @param {Object} params
     * @param {Number} params.time アニメーションにかける時間.
     * @param {Function} [params.easing=enchant.Easing.LINEAR] イージング関数.
     [/lang]
     [lang:en]
     * @param {Object} params
     * @param {Number} params.time
     * @param {Function} [params.easing=enchant.Easing.LINEAR]
     [/lang]
     [lang:de]
     * @param {Object} params
     * @param {Number} params.time
     * @param {Function} [params.easing=enchant.Easing.LINEAR]
     [/lang]
     * @constructs
     * @extends enchant.Action
     */
    initialize: function(params) {
        var origin = {};
        var target = {};
        enchant.Action.call(this, params);

        if (this.easing == null) {
            this.easing = enchant.Easing.LINEAR;
        }

        var tween = this;
        this.addEventListener(enchant.Event.ACTION_START, function() {
            // excepted property
            var excepted = ["frame", "time", "callback", "onactiontick", "onactionstart", "onactionend"];
            for (var prop in params) {
                if (params.hasOwnProperty(prop)) {
                    // if function is used instead of numerical value, evaluate it
                    var target_val;
                    if (typeof params[prop] === "function") {
                        target_val = params[prop].call(tween.node);
                    } else {
                        target_val = params[prop];
                    }

                    if (excepted.indexOf(prop) === -1) {
                        origin[prop] = tween.node[prop];
                        target[prop] = target_val;
                    }
                }
            }
        });

        this.addEventListener(enchant.Event.ACTION_TICK, function(evt) {
            // if time is 0, set property to target value immediately
            var ratio = tween.time === 0 ? 1 : tween.easing(Math.min(tween.time,tween.frame + evt.elapsed), 0, 1, tween.time) - tween.easing(tween.frame, 0, 1, tween.time);

            for (var prop in target){
                if (target.hasOwnProperty(prop)) {
                    if (typeof this[prop] === "undefined"){
                        continue;
                    }
                    tween.node[prop] += (target[prop] - origin[prop]) * ratio;
                    if (Math.abs(tween.node[prop]) < 10e-8){
                        tween.node[prop] = 0;
                    }
                }
            }
        });
    }
});
