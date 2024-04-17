
  SELECT
        e.id AS execution_id,
      {% if get_filters('profile', remove_filter=True) %}
        etr.profile AS profile,
      {% else %}
          NULL AS profile,
      {% endif %}
      {% if get_filters('browser_name', remove_filter=True) %}
        pl.browser_name AS browser,
      {% else %}
          NULL AS browser,
      {% endif %}
      {% if get_filters('os_name', remove_filter=True) %}
        pl.os_name AS os
      {% else %}
          NULL AS os
      {% endif %}

  FROM execution AS e


  {% if get_filters('profile', remove_filter=True) %}
      JOIN execution_test_result AS etr ON etr.execution_id = e.id
  {% endif %}
  {% if get_filters('browser_name', remove_filter=True) or get_filters('os_name', remove_filter=True) %}
      JOIN platform AS pl ON pl.id = e.id
  {% endif %}


  WHERE 1=1
  {% for filter in get_filters('profile', remove_filter=True) %}
      {% if filter.get('op') == 'IN' %}
          AND etr.profile = {{ "'" + filter.get('val')[0] + "'" }}
      {%- endif -%}
  {% endfor %}
  {% for filter in get_filters('browser_name', remove_filter=True) %}
      {% if filter.get('op') == 'IN' %}
          AND pl.browser_name = {{ "'" + filter.get('val')[0] + "'" }}
      {%- endif -%}
  {% endfor %}
  {% for filter in get_filters('os_name', remove_filter=True) %}
      {% if filter.get('op') == 'IN' %}
          AND pl.os_name = {{ "'" + filter.get('val')[0] + "'" }}
      {%- endif -%}
  {% endfor %}
  