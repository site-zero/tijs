import Sortable from "sortablejs";

export type TagsSortableSetup = {
    getView: () => HTMLElement | null | undefined;
    enabled: boolean;
}

export function useTagsSortable(setup: TagsSortableSetup) {
    let _sortable: Sortable | null = null;

    function clearWatching() {
        if (_sortable) {
            _sortable.destroy();
            _sortable = null;
        }
    }

    function startWatching() {
        clearWatching();
        if (!setup.enabled) {
            return
        }

        let view = setup.getView();
        if (!view) {
            return;
        }
        _sortable = new Sortable(view, {
            animation: 150,
            ghostClass: 'as-sorting-ghost',
            handle: '.as-tag-item',
            
            onEnd: function (evt) {
                console.log('onEnd', evt);
            }
        });

        return _sortable
    }

    return {
        startWatching,
        clearWatching
    }
}