{{- define "mind-journal.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "mind-journal.auth.fullname" -}}
{{- printf "%s-auth" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "mind-journal.wellness.fullname" -}}
{{- printf "%s-wellness" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "mind-journal.gateway.fullname" -}}
{{- printf "%s-gateway" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "mind-journal.mail.fullname" -}}
{{- printf "%s-mail" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "mind-journal.kafka.fullname" -}}
{{- printf "%s-kafka" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "mind-journal.prometheus.fullname" -}}
{{- printf "%s-prometheus" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "mind-journal.loki.fullname" -}}
{{- printf "%s-loki" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "mind-journal.promtail.fullname" -}}
{{- printf "%s-promtail" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "mind-journal.grafana.fullname" -}}
{{- printf "%s-grafana" .Release.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "mind-journal.ingress.scheme" -}}
{{- if .Values.ingress.tls.enabled }}https{{ else }}http{{ end }}
{{- end }}
