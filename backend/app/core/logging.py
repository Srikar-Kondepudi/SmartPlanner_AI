"""
Logging configuration with OpenTelemetry support
"""
import logging
import sys
from app.core.config import settings

def setup_logging():
    """Configure application logging"""
    log_level = logging.DEBUG if settings.DEBUG else logging.INFO
    
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # Setup OpenTelemetry if enabled
    if settings.OTEL_ENABLED:
        try:
            from opentelemetry import trace
            from opentelemetry.sdk.trace import TracerProvider
            from opentelemetry.sdk.trace.export import BatchSpanProcessor
            from opentelemetry.exporter.jaeger.thrift import JaegerExporter
            
            trace.set_tracer_provider(TracerProvider())
            tracer = trace.get_tracer(__name__)
            
            # Jaeger exporter (can be configured via env vars)
            jaeger_exporter = JaegerExporter(
                agent_host_name="localhost",
                agent_port=6831,
            )
            
            span_processor = BatchSpanProcessor(jaeger_exporter)
            trace.get_tracer_provider().add_span_processor(span_processor)
            
            logging.info("OpenTelemetry tracing enabled")
        except Exception as e:
            logging.warning(f"Failed to setup OpenTelemetry: {e}")

